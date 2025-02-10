const User = require('../models/user'); // Assuming you have a User model

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id); // Assuming you're using a user ID stored in `req.user`
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error); // Let Express handle the error
    }
};

module.exports = { getUser };
