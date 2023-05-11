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

    },
    checkLogin: (req, res, next) => {
        try {
            const token = req.cookies.token;
            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);
            // echo(decoded);
            if (decoded) {
                return res.redirect('/daily');
            }
            next();
        } catch (err) {
            res.clearCookie("token");
            next();
        }
    },
    logout: (req, res) => {
        res.clearCookie("token");
        res.redirect("/");
      },
};