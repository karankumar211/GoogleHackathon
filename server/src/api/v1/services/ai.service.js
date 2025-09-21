const { GoogleGenerativeAI } = require('@google/generative-ai');
const transactionService = require('./transaction.service'); // Reusing our existing service!

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Provides financial advice by analyzing a user's data.
 * @param {string} userId - The ID of the user asking the question.
 * @param {string} userQuery - The user's question.
 * @returns {Promise<string>} The AI-generated advice.
 */
const askFinancialCoach = async (userId, userQuery) => {
    // 1. Fetch the user's real-time financial data for context
    const summary = await transactionService.getMonthlySummary(userId);
    const context = JSON.stringify(summary, null, 2);

    // 2. Engineer a detailed prompt for the AI
    const prompt = `
        You are FinCoach AI, a friendly and insightful financial assistant.
        Your goal is to provide personalized financial advice based on the user's real-time spending data.
        Do not give generic advice. Your answer MUST be based on the data provided.
        Keep your response concise, helpful, and encouraging.

        Here is the user's current monthly financial summary:
        \`\`\`json
        ${context}
        \`\`\`

        Based on that data, please answer the following question from the user:
        Question: "${userQuery}"

        Provide only the advice in your response.
    `;

    // 3. Call the AI and get the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const advice = response.text();

    return advice;
};

module.exports = {
    askFinancialCoach,
};