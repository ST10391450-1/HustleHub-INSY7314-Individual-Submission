const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: randomUUID
        },

        fullName: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ['client', 'freelancer', 'admin'],
            default: 'client'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('User', userSchema);
