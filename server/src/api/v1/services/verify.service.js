const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Correctly initializes the AI model at the top of the file.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Analyzes a URL for potential fraud or phishing risks using AI.
 * @param {string} url - The URL to be verified.
 * @returns {Promise<object>} An object containing the verification status, risk score, and reason.
 */
const verifyLoanLink = async (url) => {
    const prompt = `
        Act as a cybersecurity analyst specializing in detecting phishing and fraudulent websites.
        Analyze the following URL: "${url}"

        Consider these common red flags:
        - Suspicious Top-Level Domains (TLDs) like .xyz, .top, .live, .cc.
        - Urgent, demanding, or too-good-to-be-true language in the domain or path.
        - URL shorteners that obscure the final destination.
        - Misspellings or slight variations of known, legitimate brand names.
        - Overly complex or long subdomains.

        Based on your analysis, return a single, minified JSON object with the following keys:
        - "status": A string, either "Safe", "Suspicious", or "Malicious".
        - "riskScore": A number from 0 (very safe) to 100 (extremely malicious).
        - "reason": A concise, one-sentence explanation for your assessment.

        Example output for a bad link: {"status":"Suspicious","riskScore":90,"reason":"The domain uses a suspicious TLD (.xyz) and employs urgent language, which are common red flags for fraudulent sites."}
        Example output for a good link: {"status":"Safe","riskScore":5,"reason":"The domain belongs to a known, reputable financial institution and uses standard security practices."}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 2. Robustly finds and parses the JSON from the AI's raw response.
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch && jsonMatch[0]) {
            try {
                const parsedResult = JSON.parse(jsonMatch[0]);
                return parsedResult;
            } catch (parseError) {
                console.error("Failed to parse JSON from AI response:", parseError);
                throw new Error("AI returned a malformed response.");
            }
        } else {
            console.error("No valid JSON object found in AI response. Raw response was:", text);
            throw new Error("AI did not provide a valid analysis.");
        }
    } catch (error) {
        // 3. Catches errors from the AI call or our parsing logic.
        console.error("Error verifying link with AI:", error);
        throw new Error(error.message || 'Failed to analyze the link.');
    }
};

module.exports = {
    verifyLoanLink,
};