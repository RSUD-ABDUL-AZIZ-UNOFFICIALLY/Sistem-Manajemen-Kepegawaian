const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { Tracker } = require("../models");

module.exports = {
    index: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let body = req.body;
        try {
            body.nik = decoded.id;
            let data = await Tracker.create(body);
            return res.status(200).json({
                error: false,
                message: "success",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                message: "error",
                data: error,
            });
        }
    }
}
