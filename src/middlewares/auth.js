const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming you have a User model

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Or use another method to extract the token
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // Assuming the user ID is stored in the decoded token
        console.log(decoded.id);
        if (!req.user) {
            return res.status(401).json({ msg: 'User not found' });
        }
        next(); // Proceed to the next middleware
    } catch (error) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = { protect };
