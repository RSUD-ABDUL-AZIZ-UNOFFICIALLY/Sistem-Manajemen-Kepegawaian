const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
    gid: "Server Side",
  };

module.exports ={
    login: (req, res) => {
        let token = jwt.sign(payload, secretKey, { expiresIn: 60 });
        // res.send('Hello World!')
        let data = {
            title: "login | LKP",
            hostwa: process.env.HOSTWA,
            token: token,
        }
        res.render('login', data)
    },
}