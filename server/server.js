require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const path = require('path');

// --- Import Routers ---
// We will create these files next
const userRouter = require('./src/api/v1/routes/user.routes');
const transactionRouter = require('./src/api/v1/routes/transaction.routes');
const aiRouter = require('./src/api/v1/routes/ai.routes');
const alertRouter = require('./src/api/v1/routes/alert.routes');
const verifyRouter = require('./src/api/v1/routes/verify.routes');
// --- End Import Routers ---



// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// --- Core Middlewares ---
// Enable Cross-Origin Resource Sharing
app.use(cors({
    origin: '*', // In production, you should restrict this to your frontend's domain
    methods: 'GET,POST,PUT,PATCH,DELETE',
}));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Enable JSON body parsing
app.use(express.json());
// --- End Core Middlewares ---


// --- API Routes ---
app.get('/', (req, res) => {
    res.status(200).json({ message: 'FinCoach AI Backend is running smoothly!' });
});

// Mount feature-specific routers
app.use('/api/v1/users', userRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/alerts', alertRouter);
app.use('/api/v1/verify', verifyRouter);
// --- End API Routes ---


// --- Global Error Handler (to be created) ---
// const errorHandler = require('./src/middlewares/errorHandler');
// app.use(errorHandler);


// --- Start Server ---
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});