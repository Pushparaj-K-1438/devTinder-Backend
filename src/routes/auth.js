const express = require('express');
const {registerUser, loginUser, logoutUser, upload} = require('../controllers/userController');
const {protect} = require('../middlewares/auth');
const {getUser} = require('../controllers/getUserController');
const router = express.Router();

console.log("getUser: ", getUser);

// Register User
router.post('/register', upload.single('profilePhoto'), registerUser);
// Login User
router.post('/login', loginUser);
// Protected route to get user profile (requires authentication)
router.get("/profile", protect, getUser);
//Logout User
router.post('/logout', logoutUser);

module.exports = router;