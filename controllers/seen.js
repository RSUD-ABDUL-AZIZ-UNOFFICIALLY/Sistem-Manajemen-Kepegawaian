const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
module.exports = {
    update: async (req, res) => {
        let token = req.cookies.token;
        // let decoded = jwt.verify(token, secretKey);
        let decoded = jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                return res.status(401).json({
                    error: true,
                    message: 'unauthorized'
                });
            }
            return decoded;
        });

        let datetime = new Date();
        // wib
        datetime.setHours(datetime.getHours() + 7);
        let data = JSON.stringify({
            name: decoded.nama,
            nik: decoded.id,
            last_seen: datetime
        });
        req.app.locals.cache.set(`seen:${decoded.id}`, data);
        req.app.locals.cache.set(`user:${decoded.id}`, data);
        req.app.locals.cache.expire(`user:${decoded.id}`, 20);
        req.app.locals.cache.quit();
        // await client.disconnect();
        return res.status(200).json({
            message: 'success',
            data: data
        });
    },
    online: async (req, res) => {

        let keys = await req.app.locals.cache.keys('user:*');
        let users = [];
        for (let key of keys) {
            let user = await req.app.locals.cache.get(key);
            users.push(JSON.parse(user));
        }
        return res.status(200).json({
            message: 'success',
            length: keys.length,
            data: {
                Online: keys.length,
                users: users
            }
        });
    },
    last_seen: async (req, res) => {

        let seen = await req.app.locals.cache.keys('seen:*');
        let online = await req.app.locals.cache.keys('user:*');
        let users = [];
        for (let key of seen) {
            let user = await req.app.locals.cache.get(key);
            users.push(JSON.parse(user));
        }
        return res.status(200).json({
            message: 'success',
            data: {
                online: online.length,
                offline: seen.length - online.length,
                users: users
            }
        });
    }
}