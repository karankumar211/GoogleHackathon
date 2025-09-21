const aiService = require('../services/ai.service');
const transactionService = require('../services/transaction.service');
const userService = require('../services/user.service'); 
const { generateFinancialInsights } = require('../services/gemini.service');
/**
 * @desc    Ask a question to the AI financial coach
 * @route   POST /api/v1/ai/ask
 * @access  Private
 */
const askAIHandler = async (req, res) => {
    try {
        const userId = req.user._id;
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ success: false, message: 'Query is required' });
        }

        const advice = await aiService.askFinancialCoach(userId, query);

        res.status(200).json({
            statusCode: 200,
            data: { advice },
            message: "AI advice generated successfully",
            success: true
        });

    } catch (error) {
        console.error("AI handler error:", error);
        res.status(500).json({ success: false, message: 'Failed to get advice from AI coach' });
    }
};
const getInsightsHandler = async (req, res) => {
    try {
        const userId = req.user.id; // Or req.user._id, depending on your auth middleware

        // 1. Fetch all necessary data for the user
        const user = req.user;
        // We need more than 10 transactions for good analysis
        const transactions = await transactionService.getAllUserTransactions(userId);

        if (!user || !transactions) {
            return res.status(404).json({ success: false, message: 'User or transaction data not found.' });
        }
        
        const insights = await generateFinancialInsights({
            budget: user.monthlyBudget,
            transactions: transactions,
        });

        res.status(200).json({ success: true, data: insights });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
module.exports = {
    askAIHandler,
    getInsightsHandler,
};