const transactionService = require('../services/transaction.service');

/**
 * @desc    Create a new transaction manually
 * @route   POST /api/v1/transactions
 * @access  Private
 */
const createTransactionHandler = async (req, res) => {
    try {
        const userId = req.user._id; // from protect middleware
        const transaction = await transactionService.createTransaction(userId, req.body);
        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Create a new transaction from SMS text
 * @route   POST /api/v1/transactions/sms
 * @access  Private
 */
const createTransactionFromSmsHandler = async (req, res) => {
    try {
        const userId = req.user._id;
        const { smsText } = req.body;
        if (!smsText) {
            return res.status(400).json({ success: false, message: 'smsText is required' });
        }
        const transaction = await transactionService.createTransactionFromSms(userId, smsText);
        res.status(201).json({ success: true, data: transaction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get the monthly spending summary
 * @route   GET /api/v1/transactions/summary
 * @access  Private
 */
const getMonthlySummaryHandler = async (req, res) => {
    try {
        const userId = req.user._id;
        const summary = await transactionService.getMonthlySummary(userId);
        res.status(200).json({ 
            statusCode: 200,
            data: summary,
            message: "Monthly summary fetched successfully",
            success: true
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getTransactionsHandler = async (req, res) => {
    try {
        // The user's ID is attached to req.user by the 'protect' middleware
        const transactions = await transactionService.getTransactions(req.user.id); // Or req.user._id
        res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error while fetching transactions' });
    }
};


module.exports = {
    createTransactionHandler,
    createTransactionFromSmsHandler,
    getMonthlySummaryHandler,
    getTransactionsHandler,
};