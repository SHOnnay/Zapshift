require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const crypto = require('crypto');
const admin = require('firebase-admin');
const Stripe = require('stripe');

const app = express();
const port = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Required env vars — fail fast on boot instead of crashing on first request
// ---------------------------------------------------------------------------
const REQUIRED_ENV = ['DB_USER', 'DB_PASSWORD', 'STRIPE_SECRET', 'FB_SERVICE_KEY', 'SITE_DOMAIN'];
for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`Missing required env var: ${key}`);
        process.exit(1);
    }
}

const stripe = Stripe(process.env.STRIPE_SECRET);

// ---------------------------------------------------------------------------
// Firebase Admin
// ---------------------------------------------------------------------------
const serviceAccount = JSON.parse(Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8'));
if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

// ---------------------------------------------------------------------------
// Mongo — single cached connection, reused across warm serverless invocations
// ---------------------------------------------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8in39f0.mongodb.net/?appName=Cluster0`;

const mongoClient = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    maxPoolSize: 10,
});

let dbHandle = null;
let connectPromise = null;

function getDb() {
    if (!connectPromise) {
        connectPromise = mongoClient.connect().then((client) => {
            dbHandle = client.db('zap_shift_db');
            console.log('MongoDB connected');
            return dbHandle;
        }).catch((err) => {
            connectPromise = null; // allow retry on next request
            throw err;
        });
    }
    return connectPromise;
}

// Gate every request behind a ready DB connection instead of registering
// routes inside an async IIFE (which races cold starts).
app.use(async (req, res, next) => {
    try {
        await getDb();
        next();
    } catch (err) {
        console.error('DB connection error:', err);
        res.status(503).send({ message: 'Service temporarily unavailable' });
    }
});

const collections = () => ({
    userCollection: dbHandle.collection('users'),
    parcelsCollection: dbHandle.collection('parcels'),
    paymentsCollection: dbHandle.collection('payments'),
    ridersCollection: dbHandle.collection('riders'),
    trackingsCollection: dbHandle.collection('trackings'),
});

// ---------------------------------------------------------------------------
// Security middleware
// ---------------------------------------------------------------------------
app.use(helmet());

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://zap-shift-8e3a6.web.app',
    ...(process.env.SITE_DOMAIN || '').split(',').map((o) => o.trim()).filter(Boolean),
];

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));

app.use(express.json());

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(generalLimiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again later.' },
});

const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------
const verifyFBToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized access' });
    }
    try {
        const idToken = authHeader.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(idToken);
        req.decoded_email = decoded.email;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).send({ message: 'Unauthorized access' });
    }
};

const verifyAdmin = async (req, res, next) => {
    try {
        const { userCollection } = collections();
        const user = await userCollection.findOne({ email: req.decoded_email });
        if (!user || user.role !== 'admin') {
            return res.status(403).send({ message: 'Forbidden: Admin access only' });
        }
        next();
    } catch (error) {
        next(error);
    }
};

// Allows the resource owner OR an admin. Compares req.decoded_email against
// an email resolved from the request (query/body/param) by the caller.
const verifySelfOrAdmin = (resolveEmail) => async (req, res, next) => {
    try {
        const targetEmail = resolveEmail(req);
        if (targetEmail && targetEmail === req.decoded_email) return next();

        const { userCollection } = collections();
        const user = await userCollection.findOne({ email: req.decoded_email });
        if (user && user.role === 'admin') return next();

        return res.status(403).send({ message: 'Forbidden access' });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function generateTrackingId() {
    const prefix = 'SHO';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `${prefix}-${date}-${random}`;
}

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isValidObjectId(id) {
    return typeof id === 'string' && ObjectId.isValid(id);
}

async function logTracking(trackingId, status) {
    const { trackingsCollection } = collections();
    return trackingsCollection.insertOne({
        trackingId,
        status,
        details: status.split('_').join(' '),
        createdAt: new Date(),
    });
}

// Wrap async route handlers so thrown errors reach the error middleware
// instead of crashing the process / hanging the request.
const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
app.get('/users', verifyFBToken, verifyAdmin, asyncHandler(async (req, res) => {
    const { userCollection } = collections();
    const searchText = (req.query.searchText || '').toString().slice(0, 100);
    const query = {};

    if (searchText) {
        const safe = escapeRegex(searchText);
        query.$or = [
            { displayName: { $regex: safe, $options: 'i' } },
            { email: { $regex: safe, $options: 'i' } },
        ];
    }

    const result = await userCollection.find(query).sort({ createdAt: -1 }).limit(10).toArray();
    res.send(result);
}));

app.get('/users/:id', verifyFBToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).send({ message: 'Invalid user ID' });

    const { userCollection } = collections();
    const target = await userCollection.findOne({ _id: new ObjectId(id) });
    if (!target) return res.status(404).send({ message: 'User not found' });

    if (target.email !== req.decoded_email) {
        const requester = await userCollection.findOne({ email: req.decoded_email });
        if (!requester || requester.role !== 'admin') {
            return res.status(403).send({ message: 'Forbidden access' });
        }
    }

    res.send(target);
}));

app.get('/users/:email/role', verifyFBToken, verifySelfOrAdmin((req) => req.params.email), asyncHandler(async (req, res) => {
    const { userCollection } = collections();
    const user = await userCollection.findOne({ email: req.params.email });
    res.send({ role: user?.role || 'user' });
}));

app.post('/users', authLimiter, asyncHandler(async (req, res) => {
    const { userCollection } = collections();
    const { email, displayName, photoURL } = req.body || {};

    if (!email || typeof email !== 'string') {
        return res.status(400).send({ message: 'Email is required' });
    }

    const existing = await userCollection.findOne({ email });
    if (existing) return res.send({ message: 'User already exists' });

    const user = {
        email,
        displayName: displayName || '',
        photoURL: photoURL || '',
        role: 'user',
        createdAt: new Date(),
    };

    const result = await userCollection.insertOne(user);
    res.send(result);
}));

app.patch('/users/:id/role', verifyFBToken, verifyAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).send({ message: 'Invalid user ID' });

    const allowedRoles = ['user', 'admin', 'rider'];
    const role = req.body?.role;
    if (!allowedRoles.includes(role)) {
        return res.status(400).send({ message: 'Invalid role' });
    }

    const { userCollection } = collections();
    const result = await userCollection.updateOne({ _id: new ObjectId(id) }, { $set: { role } });
    res.send(result);
}));

// ---------------------------------------------------------------------------
// Parcels
// ---------------------------------------------------------------------------
app.get('/parcels', verifyFBToken, asyncHandler(async (req, res) => {
    const { parcelsCollection } = collections();
    const { email, deliveryStatus } = req.query;
    const query = {};

    if (email) {
        if (email !== req.decoded_email) {
            const { userCollection } = collections();
            const requester = await userCollection.findOne({ email: req.decoded_email });
            if (!requester || requester.role !== 'admin') {
                return res.status(403).send({ message: 'Forbidden access' });
            }
        }
        query.senderEmail = email;
    }

    if (deliveryStatus) query.deliveryStatus = deliveryStatus;

    const result = await parcelsCollection.find(query).sort({ createdAt: -1 }).toArray();
    res.send(result);
}));

app.get('/parcels/rider', verifyFBToken, asyncHandler(async (req, res) => {
    const { parcelsCollection } = collections();
    const { riderEmail, deliveryStatus } = req.query;

    if (!riderEmail || riderEmail !== req.decoded_email) {
        return res.status(403).send({ message: 'Forbidden access' });
    }

    const query = { riderEmail };
    query.deliveryStatus = deliveryStatus === 'parcel_delivered'
        ? 'parcel_delivered'
        : { $nin: ['parcel_delivered'] };

    const result = await parcelsCollection.find(query).sort({ createdAt: -1 }).toArray();
    res.send(result);
}));

app.get('/parcels/delivery-status/stats', verifyFBToken, verifyAdmin, asyncHandler(async (req, res) => {
    const { parcelsCollection } = collections();
    const pipeline = [
        { $group: { _id: '$deliveryStatus', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } },
    ];
    const result = await parcelsCollection.aggregate(pipeline).toArray();
    res.send(result);
}));

app.get('/parcels/:id', verifyFBToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).send({ message: 'Invalid parcel ID' });

    const { parcelsCollection, userCollection } = collections();
    const parcel = await parcelsCollection.findOne({ _id: new ObjectId(id) });
    if (!parcel) return res.status(404).send({ message: 'Parcel not found' });

    const isOwner = parcel.senderEmail === req.decoded_email || parcel.riderEmail === req.decoded_email;
    if (!isOwner) {
        const requester = await userCollection.findOne({ email: req.decoded_email });
        if (!requester || requester.role !== 'admin') {
            return res.status(403).send({ message: 'Forbidden access' });
        }
    }

    res.send(parcel);
}));

app.post('/parcels', verifyFBToken, asyncHandler(async (req, res) => {
    const { parcelsCollection } = collections();
    const parcel = req.body || {};

    if (!parcel.senderEmail || parcel.senderEmail !== req.decoded_email) {
        return res.status(403).send({ message: 'Forbidden access' });
    }
    if (!parcel.cost || Number.isNaN(Number(parcel.cost)) || Number(parcel.cost) <= 0) {
        return res.status(400).send({ message: 'Valid parcel cost is required' });
    }

    const trackingId = generateTrackingId();
    parcel.cost = Number(parcel.cost);
    parcel.createdAt = new Date();
    parcel.trackingId = trackingId;
    parcel.paymentStatus = 'unpaid';
    parcel.deliveryStatus = 'not-paid';

    const result = await parcelsCollection.insertOne(parcel);
    await logTracking(trackingId, 'parcel_created');
    res.send(result);
}));

app.patch('/parcels/:id', verifyFBToken, verifyAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).send({ message: 'Invalid parcel ID' });

    const { riderId, riderName, riderEmail, trackingId } = req.body || {};
    if (!isValidObjectId(riderId) || !riderName || !riderEmail || !trackingId) {
        return res.status(400).send({ message: 'riderId, riderName, riderEmail and trackingId are required' });
    }

    const { parcelsCollection, ridersCollection } = collections();

    await parcelsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { deliveryStatus: 'driver_assigned', riderId, riderName, riderEmail, trackingId } }
    );

    const riderResult = await ridersCollection.updateOne(
        { _id: new ObjectId(riderId) },
        { $set: { workStatus: 'in_delivery' } }
    );

    await logTracking(trackingId, 'driver_assigned');
    res.send(riderResult);
}));

const ALLOWED_DELIVERY_STATUSES = [
    'not-paid', 'pending-pickup', 'driver_assigned', 'rider_arriving',
    'in_transit', 'parcel_delivered', 'cancelled',
];

app.patch('/parcels/:id/status', verifyFBToken, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).send({ message: 'Invalid parcel ID' });

    const { deliveryStatus, riderId, trackingId } = req.body || {};
    if (!ALLOWED_DELIVERY_STATUSES.includes(deliveryStatus)) {
        return res.status(400).send({ message: 'Invalid delivery status' });
    }

    const { parcelsCollection, ridersCollection, userCollection } = collections();
    const parcel = await parcelsCollection.findOne({ _id: new ObjectId(id) });
    if (!parcel) return res.status(404).send({ message: 'Parcel not found' });

    const isAssignedRider = parcel.riderEmail === req.decoded_email;
    if (!isAssignedRider) {
        const requester = await userCollection.findOne({ email: req.decoded_email });
        if (!requester || requester.role !== 'admin') {
            return res.status(403).send({ message: 'Forbidden access' });
        }
    }

    if (deliveryStatus === 'parcel_delivered' && isValidObjectId(riderId)) {
        await ridersCollection.updateOne({ _id: new ObjectId(riderId) }, { $set: { workStatus: 'available' } });
    }

    const result = await parcelsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { deliveryStatus } });
    if (trackingId) await logTracking(trackingId, deliveryStatus);
    res.send(result);
}));

app.delete('/parcels/:id', verifyFBToken, verifyAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).send({ message: 'Invalid parcel ID' });

    const { parcelsCollection } = collections();
    const result = await parcelsCollection.deleteOne({ _id: new ObjectId(id) });
    res.send(result);
}));

// ---------------------------------------------------------------------------
// Payments — cost is always re-derived from the stored parcel, never from
// client input, to prevent price tampering.
// ---------------------------------------------------------------------------
app.post('/payment-checkout-session', verifyFBToken, paymentLimiter, asyncHandler(async (req, res) => {
    const { parcelId } = req.body || {};
    if (!isValidObjectId(parcelId)) return res.status(400).send({ message: 'Invalid parcel ID' });

    const { parcelsCollection } = collections();
    const parcel = await parcelsCollection.findOne({ _id: new ObjectId(parcelId) });
    if (!parcel) return res.status(404).send({ message: 'Parcel not found' });

    if (parcel.senderEmail !== req.decoded_email) {
        return res.status(403).send({ message: 'Forbidden access' });
    }
    if (parcel.paymentStatus === 'paid') {
        return res.status(400).send({ message: 'Parcel already paid' });
    }

    const amount = Math.round(Number(parcel.cost) * 100);
    if (!amount || amount <= 0) return res.status(400).send({ message: 'Invalid parcel cost on record' });

    const session = await stripe.checkout.sessions.create({
        line_items: [{
            price_data: {
                currency: 'usd',
                unit_amount: amount,
                product_data: { name: `Please pay for ${parcel.parcelName || 'your parcel'}` },
            },
            quantity: 1,
        }],
        mode: 'payment',
        metadata: {
            parcelId: String(parcel._id),
            trackingId: parcel.trackingId,
            parcelName: parcel.parcelName || '',
        },
        customer_email: parcel.senderEmail,
        success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled?canceled=true`,
    });

    res.send({ url: session.url });
}));

app.patch('/payment-success', verifyFBToken, asyncHandler(async (req, res) => {
    const sessionId = req.query.session_id;
    if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).send({ message: 'session_id is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.customer_email !== req.decoded_email) {
        return res.status(403).send({ message: 'Forbidden access' });
    }

    const { paymentsCollection, parcelsCollection } = collections();
    const transactionId = session.payment_intent;

    const existingPayment = await paymentsCollection.findOne({ transactionId });
    if (existingPayment) {
        return res.send({ success: true, message: 'Payment already processed.', transactionId });
    }

    if (session.payment_status !== 'paid') {
        return res.send({ success: false });
    }

    const parcelId = session.metadata.parcelId;
    const trackingId = session.metadata.trackingId;

    const modifyParcel = await parcelsCollection.updateOne(
        { _id: new ObjectId(parcelId) },
        { $set: { paymentStatus: 'paid', deliveryStatus: 'pending-pickup' } }
    );

    const payment = {
        amount: session.amount_total / 100,
        currency: session.currency,
        customerEmail: session.customer_email,
        parcelId,
        parcelName: session.metadata.parcelName,
        transactionId,
        paymentStatus: session.payment_status,
        paidAt: new Date(),
        trackingId,
    };

    const paymentInfo = await paymentsCollection.insertOne(payment);
    await logTracking(trackingId, 'parcel_paid');

    res.send({ success: true, modifyParcel, trackingId, transactionId, paymentInfo });
}));

app.get('/payments', verifyFBToken, asyncHandler(async (req, res) => {
    const { paymentsCollection, userCollection } = collections();
    const email = req.query.email;

    if (!email) {
        const requester = await userCollection.findOne({ email: req.decoded_email });
        if (!requester || requester.role !== 'admin') {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        const result = await paymentsCollection.find({}).sort({ paidAt: -1 }).toArray();
        return res.send(result);
    }

    if (email !== req.decoded_email) {
        return res.status(403).send({ message: 'Forbidden access' });
    }

    const result = await paymentsCollection.find({ customerEmail: email }).sort({ paidAt: -1 }).toArray();
    res.send(result);
}));

// ---------------------------------------------------------------------------
// Riders
// ---------------------------------------------------------------------------
app.get('/riders', verifyFBToken, verifyAdmin, asyncHandler(async (req, res) => {
    const { ridersCollection } = collections();
    const { status, district, workStatus } = req.query;
    const query = {};
    if (status) query.status = status;
    if (district) query.district = district;
    if (workStatus) query.workStatus = workStatus;

    const result = await ridersCollection.find(query).toArray();
    res.send(result);
}));

app.get('/riders/delivery-per-day', verifyFBToken, asyncHandler(async (req, res) => {
    const email = req.query.email;
    if (!email || email !== req.decoded_email) {
        return res.status(403).send({ message: 'Forbidden access' });
    }

    const { parcelsCollection } = collections();
    const pipeline = [
        { $match: { riderEmail: email, deliveryStatus: 'parcel_delivered' } },
        { $lookup: { from: 'trackings', localField: 'trackingId', foreignField: 'trackingId', as: 'parcel_trackings' } },
        { $unwind: '$parcel_trackings' },
        { $match: { 'parcel_trackings.status': 'parcel_delivered' } },
        { $addFields: { deliveredDate: { $dateToString: { format: '%Y-%m-%d', date: '$parcel_trackings.createdAt' } } } },
    ];

    const result = await parcelsCollection.aggregate(pipeline).toArray();
    res.send(result);
}));

app.post('/riders', verifyFBToken, authLimiter, asyncHandler(async (req, res) => {
    const { ridersCollection } = collections();
    const rider = req.body || {};

    if (!rider.email || rider.email !== req.decoded_email) {
        return res.status(403).send({ message: 'Forbidden access' });
    }

    rider.status = 'pending';
    rider.workStatus = 'unavailable';
    rider.createdAt = new Date();

    const result = await ridersCollection.insertOne(rider);
    res.send(result);
}));

app.patch('/riders/:id', verifyFBToken, verifyAdmin, asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).send({ message: 'Invalid rider ID' });

    const allowedStatuses = ['pending', 'approved', 'rejected'];
    const status = req.body?.status;
    if (!allowedStatuses.includes(status)) return res.status(400).send({ message: 'Invalid status' });

    const { ridersCollection, userCollection } = collections();
    const result = await ridersCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, workStatus: 'available' } }
    );

    if (status === 'approved') {
        const rider = await ridersCollection.findOne({ _id: new ObjectId(id) });
        if (!rider?.email) return res.status(400).send({ message: 'Rider email not found' });

        const user = await userCollection.findOne({ email: rider.email });
        if (user && user.role !== 'admin') {
            await userCollection.updateOne({ email: rider.email }, { $set: { role: 'rider' } });
        }
    }

    res.send(result);
}));

// ---------------------------------------------------------------------------
// Tracking
// ---------------------------------------------------------------------------
app.get('/trackings/:trackingId/logs', verifyFBToken, asyncHandler(async (req, res) => {
    const { trackingsCollection } = collections();
    const { trackingId } = req.params;
    const result = await trackingsCollection.find({ trackingId }).sort({ createdAt: 1 }).toArray();
    res.send(result);
}));

// ---------------------------------------------------------------------------
// Health / root
// ---------------------------------------------------------------------------
app.get('/health', (req, res) => res.send({ status: 'ok', service: 'zap-shift-server' }));
app.get('/', (req, res) => res.send('Zap is shifting to a new domain!'));

// ---------------------------------------------------------------------------
// 404 + centralized error handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err);
    if (err.message && err.message.startsWith('CORS blocked')) {
        return res.status(403).send({ message: 'CORS blocked' });
    }
    const isProd = process.env.NODE_ENV === 'production';
    res.status(err.status || 500).send({
        message: isProd ? 'Internal server error' : err.message,
    });
});

// ---------------------------------------------------------------------------
// Local dev only — Vercel imports `app` directly and never calls listen()
// ---------------------------------------------------------------------------
if (require.main === module) {
    app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
}

module.exports = app;