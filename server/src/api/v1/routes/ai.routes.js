const express = require("express");
const { askAIHandler ,getInsightsHandler} = require("../controllers/ai.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// @route   POST /api/v1/ai/ask
// This route is protected. The user must be logged in.
router.post("/ask", protect, askAIHandler);
router.get('/insights', protect, getInsightsHandler);
module.exports = router;
