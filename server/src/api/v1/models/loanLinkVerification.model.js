import mongoose from 'mongoose';

const loanLinkVerificationSchema = new mongoose.Schema({
    domain: { // We will check against the domain (e.g., sbi.co.in)
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['Whitelisted', 'Blacklisted'],
        required: true,
    },
    institutionName: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

export const LoanLinkVerification = mongoose.model('LoanLinkVerification', loanLinkVerificationSchema);
