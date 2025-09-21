import { LoanLinkVerification } from '../models/loanLinkVerification.model.js';
import { getFinancialAdvice } from './gemini.service.js'; // We will reuse our Gemini service

const analyzeLinkWithAI = async (url) => {
    const prompt = `
        You are a cybersecurity expert specializing in detecting fraudulent financial websites, specifically for the Indian market.
        Analyze the following URL and provide a risk assessment.
        
        URL: "${url}"

        Consider these factors:
        1.  **Domain Name:** Does it use a standard TLD (.com, .co.in)? Or a suspicious one (.xyz, .biz)? Does it try to impersonate a real bank (e.g., sbi-loans.info)?
        2.  **HTTPS:** Does the URL use https? (Crucial for security).
        3.  **Sense of Urgency:** Does the URL path or name imply "fast cash," "instant approval," etc.?
        4.  **Overall Structure:** Does it look professional or hastily made?

        You MUST respond with a JSON object ONLY. Do not include any text before or after the JSON object, and do not use markdown.
        The JSON object must have the following exact keys:
        - "status": string (One of: "Verified", "Suspicious", "Blacklisted")
        - "riskScore": number (A score from 0 to 100, where 100 is highest risk)
        - "reason": string (A brief explanation for your assessment)
    `;

    // We reuse the getFinancialAdvice function as it's a generic prompt handler for Gemini
    const aiResponse = await getFinancialAdvice(prompt, {}); // Pass an empty object for summary
    return aiResponse; // The AI will return the JSON string.
};


export const verifyLoanLink = async (url) => {
    try {
        const urlObject = new URL(url);
        const domain = urlObject.hostname.replace('www.', '');

        // 1. Check our internal database first
        const dbRecord = await LoanLinkVerification.findOne({ domain });
        if (dbRecord) {
            return {
                status: dbRecord.status === 'Whitelisted' ? 'Verified' : 'Blacklisted',
                riskScore: dbRecord.status === 'Whitelisted' ? 0 : 100,
                reason: `This domain is on our internal ${dbRecord.status} list as belonging to ${dbRecord.institutionName}.`
            };
        }

        // 2. If not in DB, ask the AI for heuristic analysis
        const aiResultText = await analyzeLinkWithAI(url);
        const aiResultJson = JSON.parse(aiResultText.advice); // The 'advice' field contains our result
        return aiResultJson;

    } catch (error) {
        console.error("Error in link verification service:", error);
        // Fallback in case of AI error
        return {
            status: 'Suspicious',
            riskScore: 75,
            reason: 'Could not fully verify the link due to an internal error. Please proceed with caution.'
        };
    }
};
