const verifyService = require('../services/verify.service');

/**
 * @desc    Verify a URL for potential security risks
 * @route   POST /api/v1/verify/link
 * @access  Private
 */
const verifyLinkHandler = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ success: false, message: 'URL is required' });
        }

        const verificationResult = await verifyService.verifyLoanLink(url);

        res.status(200).json({
            statusCode: 200,
            data: verificationResult,
            message: "Link verification complete",
            success: true
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    verifyLinkHandler,
};