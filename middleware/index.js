const jwt = require('jsonwebtoken');
const { User } = require("../models");

module.exports = {
    login: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.redirect('/');
            }
            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);
            let getUser = await User.findOne({
                where: {
                    nik: decoded.id
                }
            });
            if (!getUser) {
                res.clearCookie("token");
                return res.redirect('/');
            }

            next();
        } catch (err) {
            res.clearCookie("token");
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