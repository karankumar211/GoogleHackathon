const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Creates a reference to the User model
        },
        amount: {
            type: Number,
            required: [true, 'Transaction amount is required'],
        },
        category: {
            type: String,
            required: [true, 'Transaction category is required'],
            trim: true,
            default: 'General'
        },
        type: {
            type: String,
            required: true,
            enum: ['Expense', 'Income'], // Only allows these two values
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;