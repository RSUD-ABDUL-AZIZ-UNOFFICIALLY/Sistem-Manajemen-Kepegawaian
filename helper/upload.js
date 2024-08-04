const axios = require('axios');
const jwt = require("jsonwebtoken");
const FormData = require('form-data');
const fs = require('fs');
const secretKey = process.env.SECRET_CDN;
const payload = {
    gid: "Server Side",
};

async function uploadImage(path) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    console.log(path)
    let formfile = new FormData();
    formfile.append('image', fs.createReadStream(path));
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process.env.HOSTCDN + "upload/img",
        headers: {
            Authorization: "Bearer " + token
        },
        data: formfile,
    };
    let response = await axios(config)
    return response.data;
}
async function uploadFile(path) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let formfile = new FormData();
    formfile.append('file', fs.createReadStream(path));
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process.env.HOSTCDN + "upload/file",
        headers: {
            Authorization: "Bearer " + token
        },
        data: formfile,
    };
    let response = await axios(config)
    return response.data;
}


module.exports = {
    uploadImage,
    uploadFile
};