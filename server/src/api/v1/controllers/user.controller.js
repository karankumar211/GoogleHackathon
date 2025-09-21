
const userService = require('../services/user.service');

// ... (registerUserHandler remains the same)
const registerUserHandler = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            monthlyBudget: user.monthlyBudget,
            createdAt: user.createdAt,
        };
        res.status(201).json({ success: true, data: userResponse });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


/**
 * @desc      Authenticate a user & get token
 * @route     POST /api/v1/users/login
 * @access    Public
 */
const loginUserHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
             return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }
        
        // This now returns an object like { token, user }
        const loginData = await userService.loginUser(email, password);
        
        // --- THIS IS THE UPDATED RESPONSE ---
        // We now send the token at the top level, as the frontend expects
        res.status(200).json({ 
            success: true, 
            token: loginData.token, 
            data: loginData.user 
        });

    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};
// --- NEW HANDLERS ---

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/profile
 * @access  Private (Requires JWT)
 */
const getUserProfileHandler = async (req, res) => {
    try {
        // The user's ID is attached to the request object (req.user.id) 
        // by the 'protect' authentication middleware.
         if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            data: {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                monthlyBudget: req.user.monthlyBudget,
                profilePic: req.user.profilePic,
                createdAt: req.user.createdAt,
            }
        });
    } catch (error) {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

/**
 * @desc    Update user profile (e.g., income, profile picture)
 * @route   PUT /api/v1/users/profile
 * @access  Private (Requires JWT)
 */
const updateUserProfileHandler = async (req, res) => {
    try {
        // Start with the text fields from the request body
        const updateData = { ...req.body };

        // The 'upload.single('profilePic')' middleware processes the file upload.
        // If a file is uploaded, its details are available in req.file.
        if (req.file) {
            // We store the path to the uploaded file.
            // In a production app, you might upload to a cloud service like S3 
            // and store the resulting URL here instead.
            updateData.profilePic = req.file.path; 
        }

        const updatedUser = await userService.updateUser(req.user.id, updateData);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// logout handler 
const logoutUserHandler = async (req, res) => {
    try{
        // Invalidate the token on the client side by instructing the client to delete it.
        res.clearCookie("token");
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    catch(error){
        res.status(400).json({ success: false, message: error.message });
    }
}


module.exports = {
    registerUserHandler,
    loginUserHandler,
    getUserProfileHandler,
    updateUserProfileHandler,
    logoutUserHandler,

};
