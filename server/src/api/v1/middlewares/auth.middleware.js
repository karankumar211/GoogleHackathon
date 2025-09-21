const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

// Protect routes (require authentication)
const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Or check token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 3️⃣ If no token found → unauthorized
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token provided" });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    // 5️⃣ Find user by ID stored in token
    const user = await User.findById(decoded.id).select("-password");


    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, user for this token does not exist",
      });
    }

    // Attach user to request object
    req.user = user;

    // ✅ Continue to next middleware/controller
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" });
  }
};

module.exports = { protect };
