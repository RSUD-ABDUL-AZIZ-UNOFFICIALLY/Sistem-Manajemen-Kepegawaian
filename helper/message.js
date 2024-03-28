require('dotenv').config();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const secretKey = process.env.SECRET_WA;
const payload = {
    gid: "Server Side",
};
const { generateDelay } = require("../helper");

async function sendWa(data) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    try {
        let randomDelay = Math.floor(Math.random() * 1000) + 1000;
        await generateDelay(randomDelay);
        let response = await axios.post(process.env.HOSTWA + "/api/wa/send", data, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
                timeout: 2000 // only wait for 2s
            }
        });
        console.log(JSON.stringify(response.data));
        return response.data;
    }
    catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.log('Request timed out');
        } else {
            console.log(error.message);
        }
        throw new Error(error);
    }
}

async function sendGrub(data){
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let config = {
        method: "post",
        url: process.env.HOSTWA + "/api/wa/sendgrub",
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
        data: data,
    };
    let randomDelay = Math.floor(Math.random() * 1000) + 1000;
    await generateDelay(randomDelay);
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
    sendGrub
};