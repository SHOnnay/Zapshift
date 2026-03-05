const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET);


const port = process.env.PORT || 3000;

const crypto = require('crypto');

const admin = require("firebase-admin");

const serviceAccount = require("./zap-shift-firebase-adminsdk.json");
const { stat } = require('fs');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


function generateTrackingId() {
    const prefix = "SHO";
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();

    return `${prefix}-${date}-${random}`;
}

//middleware
app.use(express.json());
app.use(cors());

const verifyFBToken = async (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }

    try {
        const idToken = token.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(idToken);
        req.decoded_email = decoded.email;
        console.log('Decoded token:', decoded);

        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).send({ message: 'Unauthorized access' });
    }

};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8in39f0.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db("zap_shift_db");
        const userCollection = db.collection("users");
        const parcelsCollection = db.collection("parcels");
        const paymentsCollection = db.collection("payments");
        const ridersCollection = db.collection("riders");

        //users related API

        app.get('/users', verifyFBToken, async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            user.role = 'user';
            user.createdAt = new Date();

            const email = user.email;
            const userExist = await userCollection.findOne({ email });

            if (userExist) {
                return res.send({ message: 'User already exists' });
            }

            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        //parcels API
        app.get('/parcels', async (req, res) => {
            const query = {};
            const { email } = req.query;
            // /parcel?email=''
            if (email) {
                query.senderEmail = email;
            }

            const options = { sort: { createdAt: -1 } }; // Sort by createdAt in descending order

            const cursor = parcelsCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/parcels/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const result = await parcelsCollection.findOne(query);
                res.send(result);
            } catch (error) {
                console.error('GET ERROR:', error);
                res.status(500).send({ message: 'Internal Server Error' });
            }
        });

        app.post('/parcels', async (req, res) => {
            const parcel = req.body;
            // add createdAt property to parcel
            parcel.createdAt = new Date();

            const result = await parcelsCollection.insertOne(parcel);
            res.send(result);
        });

        app.delete('/parcels/:id', async (req, res) => {
            try {
                const id = req.params.id;

                // validate ObjectId
                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ message: 'Invalid parcel ID' });
                }

                const query = { _id: new ObjectId(id) };
                const result = await parcelsCollection.deleteOne(query);

                res.send(result);
            } catch (error) {
                console.error('DELETE ERROR:', error);
                res.status(500).send({ message: 'Internal Server Error' });
            }
        });


        // Payment related API
        app.post('/payment-checkout-session', async (req, res) => {
            try {
                const paymentInfo = req.body;
                const amount = Math.round(Number(paymentInfo.cost) * 100);

                const session = await stripe.checkout.sessions.create({
                    line_items: [{
                        price_data: {
                            currency: 'usd',
                            unit_amount: amount,
                            product_data: {
                                name: `Please pay for ${paymentInfo.parcelName}`,
                            },
                        },
                        quantity: 1,
                    }],
                    mode: 'payment',
                    metadata: {
                        parcelId: paymentInfo.parcelId
                    },
                    customer_email: paymentInfo.senderEmail,
                    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-canceled?canceled=true`,
                });

                res.send({ url: session.url });
            } catch (err) {
                console.error('Stripe error:', err);
                res.status(500).send({ message: err.message });
            }
        });


        //old payment intent API
        app.post('/create-checkout-session', async (req, res) => {
            try {
                const paymentInfo = req.body;

                const amount = parseInt(paymentInfo.cost * 100);

                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                currency: 'usd',
                                product_data: {
                                    name: `Parcel Delivery Charge for ${paymentInfo.parcelName}`,
                                },
                                unit_amount: amount,
                            },
                            quantity: 1,
                        },
                    ],
                    customer_email: paymentInfo.senderEmail,
                    mode: 'payment',
                    metadata: {
                        parcelId: paymentInfo.parcelId,
                        parcelName: paymentInfo.parcelName,
                    },
                    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
                    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success`,
                });

                res.send({ url: session.url });

            } catch (error) {
                console.error(error);
                res.status(400).send({ message: error.message });
            }
        });

        app.patch('/payment-success', async (req, res) => {
            const sessionId = req.query.session_id;

            const session = await stripe.checkout.sessions.retrieve(sessionId);
            //console.log('Stripe Session:', session);

            const transactionId = session.payment_intent;
            const query = { transactionId: transactionId };
            const paymentExist = await paymentsCollection.findOne(query);
            console.log('Existing Payment:', paymentExist);

            if (paymentExist) {
                return res.send({ success: true, message: 'Payment already processed.', transactionId: transactionId });
            }


            const trackingId = generateTrackingId();

            if (session.payment_status === 'paid') {
                const id = session.metadata.parcelId;

                const query = { _id: new ObjectId(id) };
                const update = {
                    $set: {
                        paymentStatus: 'paid',
                        trackingId: trackingId,
                    }
                }
                const result = await parcelsCollection.updateOne(query, update);

                const payment = {
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    customerEmail: session.customer_email,
                    parcelId: session.metadata.parcelId,
                    parcelName: session.metadata.parcelName,
                    transactionId: session.payment_intent,
                    paymentStatus: session.payment_status,
                    paidAt: new Date(),
                    trackingId: trackingId,
                };

                if (session.payment_status === 'paid') {
                    const resultPayment = await paymentsCollection.insertOne(payment);

                    res.send({
                        success: true,
                        modifyParcel: result,
                        trackingId: trackingId,
                        transactionId: session.payment_intent,
                        paymentInfo: resultPayment
                    });
                }

            }

            res.send({ success: false });
        });

        //payment related APIs 
        app.get('/payments', verifyFBToken, async (req, res) => {
            const email = req.query.email;
            const query = {};

            //console.log(req.headers);

            if (email) {
                query.customerEmail = email;

                // Ensure that the decoded email from the token matches the requested email
                if (email !== req.decoded_email) {
                    return res.status(403).send({ message: 'Forbidden access' });
                }
            }

            const cursor = paymentsCollection.find(query).sort({ paidAt: -1 });
            const result = await cursor.toArray();
            res.send(result);
        });

        // riders related API

        app.get('/riders', async (req, res) => {
            const query = {};
            if (req.query.status) {
                query.status = req.query.status;
            }
            const cursor = ridersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/riders', async (req, res) => {
            const rider = req.body;
            rider.status = 'pending';
            rider.createdAt = new Date();

            const result = await ridersCollection.insertOne(rider);
            res.send(result);
        });

        app.patch('/riders/:id', verifyFBToken, async (req, res) => { 
            const status = req.body.status;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = { 
                $set: { 
                    status: status 
                } 
            };

            const result = await ridersCollection.updateOne(query, updatedDoc);

            if(status === 'approved') {
                const email = req.body.email;
                const userQuery = { email };
                const updateUser = {
                    $set: {
                        role: 'rider'
                    }
                };
                const userResult = await userCollection.updateOne(userQuery, updateUser);
            };

            res.send(result);
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Zap is shifting to a new domain!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});