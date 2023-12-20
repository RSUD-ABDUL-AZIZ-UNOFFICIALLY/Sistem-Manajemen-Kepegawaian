const axios = require('axios');
const jwt = require("jsonwebtoken");
const { Log } = require("../models");
const secretKey = process.env.SECRET_KHNZA;
const payload = {
    gid: "Server Side",
};

const token = jwt.sign(payload, secretKey);
async function apiGetSimrs(path) {
    let config = {
        method: "GET",
        maxBodyLength: Infinity,
        url: process.env.HOSTKHNZA + path,
        headers: {
            Authorization: "Bearer " + token
        },
    };
    let response = await axios(config);
    return response.data;
}
async function apiPostSimrs(path, data, req) {
    let logs = {
        nowa: req.user.phone,
        url: process.env.HOSTKHNZA + path,
        method: "POST",
        ip:req.ip,
        user_agent: req.headers['user-agent'],
        body: JSON.stringify(data)
    }
    
    let config = {
        method: "POST",
        maxBodyLength: Infinity,
        url: process.env.HOSTKHNZA + path,
        headers: {
            Authorization: "Bearer " + token
        },
        data: data
    };
    let response = await axios(config);
    await Log.create(logs);
    return response.data;
}



module.exports = {
    apiGetSimrs,
    apiPostSimrs
};