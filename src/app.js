
const express = require('express');
const helmet = require('helmet');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const gigRoutes = require('./routes/gigRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

//region Security and Middleware Configuration

app.use(helmet());
app.use(express.json({
    limit: '10kb'
}));

//endregion

//region Public API Endpoints

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'HustleHub+ API is running.',
        timestamp: new Date().toISOString()
    });
});

//endregion

//region API Route Configuration

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/transactions', transactionRoutes);

//endregion

//region Error Handling

app.use(notFound);
app.use(errorHandler);

//endregion

module.exports = app;
