const jwt = require('jsonwebtoken');

module.exports = {
    login: (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.redirect('/');
            }
            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);

            next();
        } catch (err) {
            return res.redirect('/');
        }

    }
};