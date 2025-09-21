import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiError } from "../../../utils/ApiError.js";

// This will now read the new, correct key you placed in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- EXISTING FUNCTION for SMS parsing ---
const parseTransactionFromSms = async (smsText) => {
    try {
        // Using gemini-1.5-flash is efficient for this kind of structured data task
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert financial transaction parser. Your task is to analyze the following SMS text and extract the transaction details.
            You MUST respond with a JSON object ONLY. Do not include any text before or after the JSON object, and do not use markdown formatting like \`\`\`json.
            The JSON object must have the following exact keys:
            - "amount": number (the transaction amount)
            - "category": string (infer the category from this list: ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Other"])
            - "type": string (must be either "Expense" or "Income")
            - "description": string (the merchant name or a brief summary of the transaction)
            Here is the SMS text: "${smsText}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        const parsedJson = JSON.parse(text);
        return parsedJson;

    } catch (error) {
        console.error("--- DETAILED GEMINI API ERROR ---", error);
        throw new ApiError(500, "Failed to parse SMS with AI service", error);
    }
};

// --- EXISTING FUNCTION for AI Chat ---
const getFinancialAdvice = async (userQuery, budgetSummary) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        let summaryLines = `Total Monthly Budget: ₹${budgetSummary.monthlyBudget}\n`;
        summaryLines += `Total Spent So Far: ₹${budgetSummary.totalSpent}\n`;
        summaryLines += `Funds Remaining: ₹${budgetSummary.remaining}\n`;
        
        if (budgetSummary.categorySpent && budgetSummary.categorySpent.size > 0) {
            summaryLines += `Spending Breakdown:\n`;
            budgetSummary.categorySpent.forEach((amount, category) => {
                summaryLines += `- ${category}: ₹${amount}\n`;
            });
        } else {
            summaryLines += `No expenses recorded yet for this month.\n`;
        }

        const prompt = `
            You are a friendly and encouraging AI financial coach for a user in India. Your tone should be supportive.
            Analyze the user's question in the context of their monthly spending summary and provide a concise, helpful, and actionable response.
            
            Here is the user's current monthly spending summary:
            ${summaryLines}

            Here is the user's question: "${userQuery}"

            Provide a direct answer to their question.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return { advice: text };
    } catch (error) {
        console.error("--- DETAILED GEMINI API ERROR ---", error);
        throw new ApiError(500, "Failed to get advice from AI service", error);
    }
};


// --- NEW FUNCTION FOR AI INSIGHTS PAGE ---
/**
 * @desc    Analyzes user financial data to generate actionable insights using Gemini.
 * @param   {object} financialData - An object containing user's budget and transactions.
 * @returns {Promise<Array>} A promise that resolves to an array of insight objects.
 */
const generateFinancialInsights = async ({ budget, transactions }) => {
    // Use the gemini-1.5-flash model as it's optimized for fast, structured JSON responses
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Define the exact JSON structure we want the AI to return.
    // This forces the model to give us clean data that matches your UI.
    const jsonSchema = {
        type: 'ARRAY',
        items: {
            type: 'OBJECT',
            properties: {
                impact: { type: 'STRING', description: "High, Medium, or Low" },
                type: { 
                    type: 'STRING', 
                    description: "The category of the insight. Must be one of: 'Spending Tips', 'Savings Advice', 'Investment', 'Debt Management'." 
                },
                category: { type: 'STRING', description: "e.g., Food & Dining, Savings, Investment" },
                title: { type: 'STRING' },
                confidence: { type: 'NUMBER', description: "A confidence score from 0 to 100" },
                summary: { type: 'STRING', description: "A one-sentence summary of the insight." },
                actionItems: { type: 'ARRAY', items: { type: 'STRING' } },
                estimatedAnnualSavings: { type: 'NUMBER', description: "Estimated savings in INR (₹)" }
            },
            required: ["impact", "category", "title", "confidence", "summary", "actionItems", "estimatedAnnualSavings"]
        }
    };

    const prompt = `
        You are an expert financial analyst AI for an app in India. Your goal is to provide 3-5 actionable, personalized financial insights based on the user's data.
        Analyze the following data for a user. The currency is Indian Rupees (₹).

        User's Monthly Budget: ₹${budget.toLocaleString('en-IN')}

        User's Transactions for the last 60 days:
        ${JSON.stringify(transactions, null, 2)}

        Based on this data, identify key areas for improvement, potential savings, and financial opportunities. 
        For each insight, you must classify it by providing a 'type'. The type must be one of the following exact strings: 'Spending Tips', 'Savings Advice', 'Investment', or 'Debt Management'.
        Also provide a clear title, a summary, a confidence score, the potential impact, actionable steps, and an estimated annual savings in INR.

        You MUST respond with a valid JSON array that strictly conforms to the provided schema. Do not include any other text, markdown, or explanations.
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: jsonSchema,
            },
        });

        const responseText = result.response.text();
        // The API returns a JSON string, so we need to parse it
        return JSON.parse(responseText);

    } catch (error) {
        console.error("Error generating insights from Gemini:", error);
        throw new ApiError(500, "Failed to generate AI insights.");
    }
};


// Update the exports to include the new function
export { parseTransactionFromSms, getFinancialAdvice, generateFinancialInsights };

