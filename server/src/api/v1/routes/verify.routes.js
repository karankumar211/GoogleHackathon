const express = require("express");
const { verifyLinkHandler } = require("../controllers/verify.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// @route   POST /api/v1/verify/link
// Protected to prevent anonymous abuse of the AI endpoint.
router.post("/link", protect, verifyLinkHandler);

module.exports = router;
