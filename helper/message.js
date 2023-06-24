require('dotenv').config();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const secretKey = process.env.SECRET_WA;
const payload = {
    gid: "Server Side",
};

async function sendWa(data) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let config = {
        method: "post",
        url: process.env.HOSTWA + "/api/wa/send",
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
        data: data,
    };
    await axios
        .request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            return response.data;
        })
        .catch((error) => {
            console.log(error);
            return error;
        });
}

module.exports = {
    sendWa,
};