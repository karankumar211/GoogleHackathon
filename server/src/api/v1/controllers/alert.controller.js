const alertService = require('../services/alert.service');

/**
 * @desc    Get all unread alerts for the logged-in user
 * @route   GET /api/v1/alerts
 * @access  Private
 */
const getUnreadAlertsHandler = async (req, res) => {
    try {
        const userId = req.user._id;
        const alerts = await alertService.getUnreadAlerts(userId);
        res.status(200).json({ success: true, count: alerts.length, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch alerts' });
    }
};

/**
 * @desc    Mark an alert as read
 * @route   PATCH /api/v1/alerts/:alertId/read
 * @access  Private
 */
const markAlertAsReadHandler = async (req, res) => {
    try {
        const userId = req.user._id;
        const { alertId } = req.params;
        const updatedAlert = await alertService.markAlertAsRead(userId, alertId);
        res.status(200).json({ success: true, data: updatedAlert });
    } catch (error) {
        // If the service throws an error (e.g., not found), send a 404
        res.status(404).json({ success: false, message: error.message });
    }
};
 
module.exports = {
    getUnreadAlertsHandler,
    markAlertAsReadHandler,
};