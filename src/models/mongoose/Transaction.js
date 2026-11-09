const mongoose = require('mongoose');
const { randomUUID } = require('crypto');
const transactionSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: randomUUID
        },

        bookingId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        clientId: {
            type: String,
            required: true,
            index: true
        },

        freelancerId: {
            type: String,
            required: true,
            index: true
        },

        gigId: {
            type: String,
            required: true,
            index: true
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
            max: 1000000
        },

        status: {
            type: String,
            enum: ['simulated', 'completed'],
            default: 'simulated',
            index: true
        },

        completedAt: {
            type: Date,
            default: null
        },
        
        paymentMethod: {
            type: String,
            enum: ['simulation'],
            default: 'simulation'
        }
    },
    {
        timestamps: {
            createdAt: true,
            updatedAt: false
        },
        versionKey: false
    }
);

module.exports = mongoose.model('Transaction', transactionSchema);
