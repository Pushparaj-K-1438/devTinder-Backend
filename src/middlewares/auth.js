const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({msg: 'Token is not valid'});
    }
}

module.exports = protect;