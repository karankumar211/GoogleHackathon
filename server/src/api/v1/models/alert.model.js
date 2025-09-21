const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        message: {
            type: String,
            required: [true, 'Alert message is required.'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['Budget', 'Info', 'Warning'],
            default: 'Info',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;