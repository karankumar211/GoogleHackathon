const express = require('express');
const {
    registerUserHandler,
    loginUserHandler,
    getUserProfileHandler,
    logoutUserHandler,

} = require('../controllers/user.controller');

const { protect } = require('../middlewares/auth.middleware');

// --- THIS IS THE FIX ---
// Use curly braces {} to destructure the 'upload' object from the module


const router = express.Router();

// Public routes for authentication
router.post('/register', registerUserHandler);
router.post('/login', loginUserHandler);

// Protected routes for user profile
router.get('/profile', protect, getUserProfileHandler)
    
router.post('/logout', protect, logoutUserHandler);
module.exports = router;

