const jwt = require('jsonwebtoken');
const checkToken = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) {
        return res.status(403)
            .json({ message: 'JWT token is required' });
    }
    try {
        const verify = jwt.verify(token, process.env.JWT_KEY);
        req.user = verify;
        next();
    } catch (err) {
        return res.status(403)
            .json({ message: 'JWT token is wrong or expired' });
    }
}

module.exports = checkToken;