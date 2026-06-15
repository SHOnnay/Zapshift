const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET);


const port = process.env.PORT || 3000;

const crypto = require('crypto');

const admin = require("firebase-admin");


const decoded = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded);

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
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://zap-shift-8e3a6.web.app',
  ...(process.env.SITE_DOMAIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean),
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.post('/debug-post', (req, res) => {
    res.send({ ok: true, message: 'POST route is working', body: req.body });
});

app.get('/debug-get', (req, res) => {
    res.send({ ok: true, message: 'GET route is working' });
});

app.post('/users', async (req, res) => {
  try {
    const db = client.db("zap_shift_db");
    const userCollection = db.collection("users");

    const user = req.body;

    if (!user?.email) {
      return res.status(400).send({ message: 'Email is required' });
    }

    const userExist = await userCollection.findOne({ email: user.email });

    if (userExist) {
      return res.send({ message: 'User already exists' });
    }

    user.role = 'user';
    user.createdAt = new Date();

    const result = await userCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    console.error('POST /users error:', error);
    res.status(500).send({ message: error.message });
  }
});

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true
}));


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
        const trackingsCollection = db.collection("trackings");

        //middleware for verifying Firebase token
        // must be used after verifyFBToken middleware
        const verifyFBToken = async (req, res, next) => {

            const token = req.headers.authorization;


            if (!token) {
                return res.status(401).send({ message: 'Unauthorized access' });
            }

            try {
                const idToken = token.split(' ')[1];
                const decoded = await admin.auth().verifyIdToken(idToken);
                req.decoded_email = decoded.email;
                next();
            }
            catch (error) {
                console.error('Token verification error:', error);
                return res.status(401).send({ message: 'Unauthorized access' });
            }

        };

        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded_email;
            const query = { email };
            const user = await userCollection.findOne(query);

            if (!user || user.role !== 'admin') {
                return res.status(403).send({ message: 'Forbidden: Admin access only' });
            }

            next();
        };

        const logTracking = async (trackingId, status) => {
            const log = {
                trackingId,
                status,
                details: status.split('_').join(' '),
                createdAt: new Date(),
            }
            const result = await trackingsCollection.insertOne(log);
            return result;
        }

        //users related API

        app.get('/users', verifyFBToken, async (req, res) => {

            const searchText = req.query.searchText || '';
            const query = {};

            if (searchText) {
                query.$or = [
                    { displayName: { $regex: searchText, $options: 'i' } },
                    { email: { $regex: searchText, $options: 'i' } }
                ];
            }

            const cursor = userCollection.find(query).sort({ createdAt: -1 }).limit(10);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.get('/users/:email/role', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userCollection.findOne(query);
            res.send({ role: user?.role || 'user' });
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

        app.patch('/users/:id/role', verifyFBToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const roleInfo = req.body.role;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: roleInfo.role
                }
            };
            const result = await userCollection.updateOne(query, updatedDoc);
            res.send(result);
        });

        //parcels API
        app.get('/parcels', async (req, res) => {
            const query = {};
            const { email, deliveryStatus } = req.query;

            // /parcel?email=''
            if (email) {
                query.senderEmail = email;
            }

            if (deliveryStatus) {
                query.deliveryStatus = deliveryStatus;
            }

            const options = { sort: { createdAt: -1 } }; // Sort by createdAt in descending order

            const cursor = parcelsCollection.find(query, options);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/parcels/rider', async (req, res) => {
            const { riderEmail, deliveryStatus } = req.query;
            const query = {}
            if (riderEmail) {
                query.riderEmail = riderEmail;
            }
            if (deliveryStatus !== 'parcel_delivered') {
                // query.deliveryStatus = {$in: ['driver_assigned', 'rider_arriving'] };
                query.deliveryStatus = { $nin: ['parcel_delivered'] };
            }
            else {
                query.deliveryStatus = deliveryStatus;
            }

            const cursor = parcelsCollection.find(query).sort({ createdAt: -1 });
            const result = await cursor.toArray();
            res.send(result);

        });

        app.get('/parcels/delivery-status/stats', async (req, res) => {
            const pipeline = [
                {
                    $group: {
                        _id: "$deliveryStatus",
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        status: "$_id",
                        count: 1,
                        _id: 0
                    }
                }
            ];
            const result = await parcelsCollection.aggregate(pipeline).toArray();
            res.send(result);

        });

        app.get('/parcels/:id', async (req, res) => {
            try {
                const id = req.params.id;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).send({ message: 'Invalid parcel ID' });
                }

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
            const trackingId = generateTrackingId();
            // add createdAt property to parcel
            parcel.createdAt = new Date();
            parcel.trackingId = trackingId;
            parcel.paymentStatus = 'unpaid';
            parcel.deliveryStatus = 'not-paid';

            logTracking(trackingId, 'parcel_created');

            const result = await parcelsCollection.insertOne(parcel);
            res.send(result);
        });

        //todo: rename
        app.patch('/parcels/:id', async (req, res) => {
            const { riderId, riderName, riderEmail, trackingId } = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };

            const updatedDoc = {
                $set: {
                    deliveryStatus: 'driver_assigned',
                    riderId: riderId,
                    riderName: riderName,
                    riderEmail: riderEmail,
                    trackingId: trackingId
                }
            };
            const result = await parcelsCollection.updateOne(query, updatedDoc);

            //update rider infromation
            const riderQuery = { _id: new ObjectId(riderId) };
            const riderUpdatedDoc = {
                $set: {
                    workStatus: 'in_delivery',
                }
            };
            const riderResult = await ridersCollection.updateOne(riderQuery, riderUpdatedDoc);
            //log tracking info
            await logTracking(trackingId, 'driver_assigned');

            res.send(riderResult);
        });

        app.patch('/parcels/:id/status', async (req, res) => {
            const { deliveryStatus, riderId, trackingId } = req.body;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    deliveryStatus: deliveryStatus,
                }
            };

            if (deliveryStatus === 'parcel_delivered') {
                //update rider infromation
                const riderQuery = { _id: new ObjectId(riderId) };
                const riderUpdatedDoc = {
                    $set: {
                        workStatus: 'available',
                    }
                };
                const riderResult = await ridersCollection.updateOne(riderQuery, riderUpdatedDoc);
            }
            const result = await parcelsCollection.updateOne(query, updatedDoc);
                //log tracking info
                await logTracking(trackingId, deliveryStatus);
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
                        parcelId: paymentInfo.parcelId,
                        trackingId: paymentInfo.trackingId,
                        parcelName: paymentInfo.parcelName,
                    },
                    customer_email: paymentInfo.senderEmail,
                    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled?canceled=true`,
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
            if (paymentExist) {
                return res.send({ success: true, message: 'Payment already processed.', transactionId: transactionId });
            }

            //using trackingId from metadata to log tracking info when payment is successful
            const trackingId = session.metadata.trackingId;

            if (session.payment_status === 'paid') {
                const id = session.metadata.parcelId;

                const query = { _id: new ObjectId(id) };
                const update = {
                    $set: {
                        paymentStatus: 'paid',
                        deliveryStatus: 'pending-pickup'
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

                    await logTracking(trackingId, 'parcel_paid');

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
            const { status, district, workStatus } = req.query;
            const query = {};

            if (status) {
                query.status = status;
            }

            if (district) {
                query.district = district;
            }
            if (workStatus) {
                query.workStatus = workStatus;
            }

            const cursor = ridersCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/riders/delivery-per-day', async (req, res) => {
            const email = req.query.email;
            const pipeline = [
                {
                    $match: {
                        riderEmail: email,
                        deliveryStatus: 'parcel_delivered'
                    }
                },
                {
                    $lookup: {
                        from: 'trackings',
                        localField: 'trackingId',
                        foreignField: 'trackingId',
                        as: 'parcel_trackings'
                    }
                },
                {
                    $unwind: '$parcel_trackings'
                },
                {
                    $match: {
                        'parcel_trackings.status': 'parcel_delivered'
                    }
                },
                {
                    //convert timestamp to date string
                    $addFields: {
                        deliveredDate: {
                            $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$parcel_trackings.createdAt"
                            }
                        }
                    }
                }
            ];

            const result = await parcelsCollection.aggregate(pipeline).toArray();
            res.send(result);
        });

        app.post('/riders', async (req, res) => {
            const rider = req.body;
            rider.status = 'pending';
            rider.createdAt = new Date();

            const result = await ridersCollection.insertOne(rider);
            res.send(result);
        });

        app.patch('/riders/:id', verifyFBToken, verifyAdmin, async (req, res) => {
            const status = req.body.status;
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: status,
                    workStatus: 'available'
                }
            };

            const result = await ridersCollection.updateOne(query, updatedDoc);

            if (status === 'approved') {
                const rider = await ridersCollection.findOne(query);

                const email = rider?.email;

                if (!email) {
                    return res.status(400).send({ message: 'Rider email not found' });
                }

                const user = await userCollection.findOne({ email });

                if (user && user.role !== 'admin') {
                    await userCollection.updateOne(
                        { email },
                        { $set: { role: 'rider' } }
                    );
                }
            }

            res.send(result);
        });

        //tracking related API
        app.get('/trackings/:trackingId/logs', async (req, res) => {
            const trackingId = req.params.trackingId;
            const query = { trackingId };
            const result = await trackingsCollection.find(query).sort({ createdAt: 1 }).toArray();
            res.send(result);
        });

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/health', (req, res) => {
    res.send({ status: 'ok', service: 'zap-shift-server' });
});

app.get('/', (req, res) => {
    res.send('Zap is shifting to a new domain!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
}

module.exports = app;