const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const bookingSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: randomUUID
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
            enum: [
                'pending',
                'accepted',
                'rejected',
                'submitted',
                'revision_requested',
                'completed'
            ],
            default: 'pending',
            index: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Booking', bookingSchema);
