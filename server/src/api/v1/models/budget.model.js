import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: { // e.g., 8 for September
        type: Number,
        required: true,
    },
    year: { // e.g., 2025
        type: Number,
        required: true,
    },
    totalSpent: {
        type: Number,
        default: 0,
    },
    // We store spending per category in a map for flexibility
    categorySpent: {
        type: Map,
        of: Number,
        default: {}
    },
    monthlyBudget: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});

// Create a compound index to ensure one budget document per user per month/year
budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export const Budget = mongoose.model('Budget', budgetSchema);
