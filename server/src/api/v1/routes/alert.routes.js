const express = require("express");
const {
  getUnreadAlertsHandler,
  markAlertAsReadHandler,
} = require("../controllers/alert.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Get all unread alerts
// @route GET /api/v1/alerts
router.get("/", protect, getUnreadAlertsHandler);

// Mark a specific alert as read
// @route PATCH /api/v1/alerts/:alertId/read
router.patch("/:alertId/read", protect, markAlertAsReadHandler);

module.exports = router;
