const mongoose = require('mongoose');
const os = require('os');
const config = require('./config');

async function connectDatabase() {
    try {
        await mongoose.connect(config.database.mongoUri, {
            serverSelectionTimeoutMS: 5000,
            autoIndex: config.environment !== 'production',

            ...(config.environment === 'test'
                ? {
                    runtimeAdapters: {
                        os: os
                    }
                }
                : {})
        });

        console.log('HustleHub+ MongoDB connection established successfully.');

        return mongoose.connection;
    } catch (error) {
        console.error(
            'HustleHub+ MongoDB connection failed:',
            error.message
        );

        throw error;
    }
}

mongoose.connection.on('disconnected', () => {
    console.warn('HustleHub+ MongoDB connection lost.');
});

mongoose.connection.on('error', error => {
    console.error(
        'HustleHub+ MongoDB connection error:',
        error.message
    );
});

async function disconnectDatabase() {
    await mongoose.disconnect();

    console.log('HustleHub+ MongoDB connection closed.');
}

module.exports = {
    connectDatabase,
    disconnectDatabase
};
