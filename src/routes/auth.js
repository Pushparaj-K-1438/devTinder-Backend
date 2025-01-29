const express = require('express');
const {registerUser, loginUser} = require('../controllers/userController');
const {protect} = require('../middlewares/auth');
const router = express.Router();

// Register User
router.post('/register', registerUser);
// Login User
router.post('/login', loginUser);
// Protected route to get user profile (requires authentication)
// router.get("/profile", protect, getUserProfile);

module.exports = router;