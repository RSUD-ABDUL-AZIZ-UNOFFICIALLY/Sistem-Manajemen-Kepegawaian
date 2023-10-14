const jwt = require("jsonwebtoken");
const { format } = require("mysql");
const secretKey = process.env.JWT_SECRET_KEY;
const { createClient } = require('redis');
// const client = await createClient({
//     url: process.env.REDIS_URL
// })
// .on('error', err => console.log('Redis Client Error', err))
// .connect();
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
        const client = await createClient({
            url: process.env.REDIS_URL
        })
            .on('error', err => console.log('Redis Client Error', err))
            .connect();

        let datetime = new Date();
        // wib
        datetime.setHours(datetime.getHours() + 7);
        let data = JSON.stringify({
            name: decoded.nama,
            nik: decoded.id,
            last_seen: datetime
        });
        client.set(`seen:${decoded.id}`, data);
        client.set(`user:${decoded.id}`, data);
        client.expire(`user:${decoded.id}`, 10);
        client.quit();
        // await client.disconnect();
        return res.status(200).json({
            message: 'success',
            data: data
        });
    },
    online: async (req, res) => {
        const client = await createClient({
            url: process.env.REDIS_URL
        })
            .on('error', err => console.log('Redis Client Error', err))
            .connect();

        let keys = await client.keys('user:*');
        let users = [];
        for (let key of keys) {
            let user = await client.get(key);
            users.push(JSON.parse(user));
        }
        client.quit();
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
        const client = await createClient({
            url: process.env.REDIS_URL
        })
            .on('error', err => console.log('Redis Client Error', err))
            .connect();

        let seen = await client.keys('seen:*');
        let online = await client.keys('user:*');
        let users = [];
        for (let key of seen) {
            let user = await client.get(key);
            users.push(JSON.parse(user));
        }
        client.quit();
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