const express = require("express");
const {
  createTransactionHandler,
  createTransactionFromSmsHandler,
  getMonthlySummaryHandler,
} = require("../controllers/transaction.controller");
const { protect } = require("../middlewares/auth.middleware"); // Adjusted path

const router = express.Router();

// All routes in this file are protected and require a valid token.
// The `protect` middleware runs first, verifies the user, and attaches `req.user`.

// @route   POST /api/v1/transactions
router.post("/", protect, createTransactionHandler);

// @route   POST /api/v1/transactions/sms
router.post("/sms", protect, createTransactionFromSmsHandler);

// @route   GET /api/v1/transactions/summary
router.get("/summary", protect, getMonthlySummaryHandler);

module.exports = router;
