const User = require('../models/user.model'); // Assuming your model path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Registers a new user
 */
const registerUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

/**
 * Logs in a user and returns user data and a JWT token
 */
const loginUser = async (email, password) => {
    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid email or password');
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    // 3. --- THIS IS THE MISSING STEP ---
    // If password matches, generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });

    // 4. Return both the token and the user's public data
    return {
        token,
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            monthlyBudget: user.monthlyBudget,
        },
    };
};

module.exports = {
    registerUser,
    loginUser,
};
