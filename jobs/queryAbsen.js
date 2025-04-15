const { Dump_Absen, Mesin_Absen, sequelize } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const qs = require('qs');
async function queryAbsen() {
    let find_mesin = await Mesin_Absen.findAll();
    console.log(find_mesin);
    for (let m of find_mesin) {
      let login = await login_mesin(m.sn, m.pass)
     await   getAbsen(login, m.sn)
    }
    console.log("Selesai");
}

async function login_mesin(sn,pass) {
    let data = qs.stringify({
        sn, pass
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://www.solutioncloud.co.id/sc_pro.asp',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: data
    };
    let res = await axios(config)
    let cookie = res.headers['set-cookie'].map((item) => item.split(';')[0]).join('; ');
    console.log(cookie);
    return cookie;
}
async function getAbsen(cookie,sn) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://www.solutioncloud.co.id/view.asp',
        headers: {
            'Cookie': cookie
        }
    };
    let res = await axios(config)
    // console.log(res.data);
    // console.log(typeof res.data);
    const convertToJson = (str) => {
        return str
            .trim()
            .split('\n')
            .map(line => {
                const [id_finger, timestamp, id_mesin, status, Verifikasi] = line.split('\t');
                const [tanggal, jam] = timestamp.split(' ');
                return {
                    id_finger: parseInt(id_finger),
                    tanggal,
                    jam,
                    id_mesin: parseInt(id_mesin),
                    status: status,
                    Verifikasi: parseInt(Verifikasi),
                    sn: sn
                };
            });
    };

    const jsonData = convertToJson(res.data);
    // console.log(jsonData);
    // Dump_Absen.bulkCreate(jsonData)
    // let x =  await Dump_Absen.bulkCreate(jsonData, {
    //     ignoreDuplicates: true // hanya works di MySQL dan MariaDB
    // });
    // console.log(x.length);
    let x = await Dump_Absen.bulkCreate(jsonData, {
        updateOnDuplicate: ['status'] // field yang boleh di-update
    });
    console.log(x);
    console.log(x.length);
    await updateAutoIncrement(Dump_Absen, 'Dump_Absens');

    return;
    // console.log(JSON.stringify(jsonData, null, 2));
}

const updateAutoIncrement = async (model, tableName) => {
    const max = await model.max('id');
    const nextAutoIncrement = max + 1;

    await sequelize.query(`ALTER TABLE ${tableName} AUTO_INCREMENT = ${nextAutoIncrement}`);
    console.log(`AUTO_INCREMENT untuk ${tableName} diset ke ${nextAutoIncrement}`);
};

queryAbsen()

function cekUrutan(array) {
    for (let i = 1; i < array.length; i++) {
        if (array[i] !== array[i - 1] + 1) {
            console.log(`Tidak berurutan di indeks ${i}, nilai: ${array[i]}`);
            return false;
        }
    }
    console.log("Array berurutan.");
    return true;
}
async function test() {
    let data = await Dump_Absen.findAll({
        attributes: ['id'],
        order: [
            ['id', 'ASC']
        ],
        // limit: 10
    })
    let array = data.map((item) => item.id);
    // console.log(array);
    cekUrutan(array);
    // console.log(array);
    // let x = await Dump_Absen.findAll({
}
// test()
// console.log("tes");