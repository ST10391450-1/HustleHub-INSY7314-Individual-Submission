const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const gigSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: randomUUID
        },

        freelancerId: {
            type: String,
            required: true,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        },

        category: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },

        price: {
            type: Number,
            required: true,
            min: 1,
            max: 1000000
        },

        deliveryDays: {
            type: Number,
            required: true,
            min: 1,
            max: 365
        },

        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active',
            index: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Gig', gigSchema);
