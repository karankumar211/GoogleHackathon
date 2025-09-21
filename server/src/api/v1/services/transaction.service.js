const Transaction = require('../models/transaction.model');
const User = require('../models/user.model');
const Alert = require('../models/alert.model');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Creates a manual transaction and checks the budget.
 * @param {string} userId - The ID of the user.
 * @param {object} transactionData - The transaction details.
 * @returns {Promise<object>} The newly created transaction object.
 */
const createTransaction = async (userId, transactionData) => {
    const transaction = await Transaction.create({
        user: userId,
        ...transactionData,
    });
    
    // Placeholder for proactive budget alert logic
    // await checkBudgetAndCreateAlert(userId);

    return transaction;
};

/**
 * Parses an SMS using AI and creates a transaction.
 * @param {string} userId - The ID of the user.
 * @param {string} smsText - The raw SMS content.
 * @returns {Promise<object>} The newly created transaction object.
 */
const createTransactionFromSms = async (userId, smsText) => {
    const prompt = `
        Analyze the following bank transaction SMS and extract the key details.
        SMS: "${smsText}"

        Return a single, minified JSON object with the following keys:
        - "amount": number (the transaction amount)
        - "type": string ("Expense" or "Income")
        - "category": string (e.g., "Food", "Shopping", "UPI", "Transfer", "Salary")
        - "description": string (a brief description, like the merchant name)
        
        Example Output: {"amount": 350.00, "type": "Expense", "category": "Food", "description": "Zomato"}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
        const parsedData = JSON.parse(text);
        if (!parsedData.amount || !parsedData.type) {
            throw new Error('AI failed to parse essential transaction details.');
        }
        return await createTransaction(userId, parsedData);
    } catch (error) {
        console.error("Error parsing AI response:", error);
        throw new Error('Could not process the transaction from SMS.');
    }
};

/**
 * Fetches and calculates the monthly financial summary for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} The aggregated monthly summary.
 */
const getMonthlySummary = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const transactions = await Transaction.find({
        user: userId,
        type: 'Expense',
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    let totalSpent = 0;
    const categorySpent = {};

    transactions.forEach(t => {
        totalSpent += t.amount;
        categorySpent[t.category] = (categorySpent[t.category] || 0) + t.amount;
    });

    return {
        monthlyBudget: user.monthlyBudget,
        totalSpent,
        remaining: user.monthlyBudget - totalSpent,
        categorySpent,
    };
};

const getAllUserTransactions = async (userId) => {
    // Fetch all transactions from the last 60 days for analysis
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    return Transaction.find({ user: userId, createdAt: { $gte: sixtyDaysAgo } }).sort({ createdAt: -1 });
};

module.exports = {
    createTransaction,
    createTransactionFromSms,
    getMonthlySummary,
    getAllUserTransactions,
};