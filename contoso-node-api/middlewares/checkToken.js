const jwt = require('jsonwebtoken');
const config = require('../config.json');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        const decodedToken = jwt.verify(token, config.jwtPrivateKey);
        req.userData = { email: decodedToken.email, userType: decodedToken.userType };
        next();
    }
    catch (err) {
        
        return res.status(403).json({ message: "Unauthorized" });
    }
};