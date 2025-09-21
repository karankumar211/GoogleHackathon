const Alert = require('../models/alert.model');

/**
 * Fetches all unread alerts for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} An array of unread alert objects.
 */
const getUnreadAlerts = async (userId) => {
    // Find all alerts for the user where isRead is false
    // Sort by most recent first
    const alerts = await Alert.find({ user: userId, isRead: false }).sort({ createdAt: -1 });
    return alerts;
};

/**
 * Marks a specific alert as read.
 * @param {string} userId - The ID of the user who owns the alert.
 * @param {string} alertId - The ID of the alert to update.
 * @returns {Promise<object>} The updated alert object.
 */
const markAlertAsRead = async (userId, alertId) => {
    // Find the alert by its ID and ensure it belongs to the requesting user
    const alert = await Alert.findOne({ _id: alertId, user: userId });

    if (!alert) {
        throw new Error('Alert not found or you do not have permission to modify it.');
    }

    alert.isRead = true;
    await alert.save();
    return alert;
};

module.exports = {
    getUnreadAlerts,
    markAlertAsRead,
};