const { Absen, Dump_Absen, Mesin_Absen, Maps_Absen, Jdldns, Jnsdns, sequelize } = require("../models");
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
    await updateAutoIncrement(Dump_Absen, 'Dump_Absens');
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

// queryAbsen()

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
    await cekUrutan(array);
    console.log(array.length);
    console.log(array[array.length - 1]);
    // let x = await Dump_Absen.findAll({
}
// test()
// console.log("tes");

async function setAbsen(date) {
    let find_user = await Maps_Absen.findAll({
        // where: {
        //     nik: "6171051111980007"
        // },
        include: {
            model: Dump_Absen,
            as: 'dump_absen',
            where: {
                tanggal: date
            },
            order: [
                ['jam', 'ASC']
            ],
            include: {
                model: Mesin_Absen,
                as: 'mesin_absen',
            }
        },
        attributes: ['nik'],
    });
    // console.log(find_user);
    for (let i of find_user) {
        // console.log(i);
        let jadwal_dns = await Jdldns.findOne({
            where: {
                nik: i.nik,
                date: date
            },
            include: {
                model: Jnsdns,
                as: 'dnsType',
            }
        });

        if (!jadwal_dns) {
            console.log("tidak ada jadwal");
            continue;
        }
        // console.log(i.dump_absen.length);
        let data_absen = [];
        for (let j of i.dump_absen) {
            // console.log(j.dataValues);
            data_absen.push({
                id_finger: j.id_finger,
                tanggal: j.tanggal,
                jam: j.jam,
                status: j.status,
                sn: j.sn,
                lokasi: j.mesin_absen.name,
            });
            // console.log(jadwal_dns);

        }
        // console.log(data_absen);
        // Absen Masuk
        const filtered = data_absen.filter(item => item.status === '0');
        if (filtered[0]) {
            // console.log(filtered[0]);
            await cekIn(filtered[0], jadwal_dns);
        }

        // // // Absen Pulang
        const filtered2 = data_absen.filter(item => item.status === '1');
        if (filtered2[0]) {
            // console.log(filtered2[0]);
            await cekOut(filtered2[0], jadwal_dns);
        }

    }


}
setAbsen("2025-04-16")

async function cekIn(finger, jadwal_dns) {
    console.log(finger);
    let start_min = jadwal_dns.dataValues.dnsType.dataValues.start_min;
    let start_max = jadwal_dns.dataValues.dnsType.dataValues.start_max;
    let isCekIn = await Absen.findOne({
        where: {
            nik: jadwal_dns.dataValues.nik,
            date: finger.tanggal
        }
    });
    if (!isCekIn) {
        let statusin = checkAttendance(finger.jam, start_min, start_max);
        let keteranganIn = '';
        if (statusin == 'Masuk Terlambat') {
            let terlambat = hitungMenitTerlambat(finger.jam, start_max);
            keteranganIn += 'Terlambat ' + terlambat + ' menit';
        }
        let absen = await Absen.create({
            nik: jadwal_dns.dataValues.nik,
            typeDns: jadwal_dns.dataValues.typeDns,
            date: finger.tanggal,
            cekIn: finger.jam,
            statusIn: statusin,
            keteranganIn: keteranganIn,
            nilaiIn: 3,
            geoIn: '',
            loactionIn: finger.lokasi,
            visitIdIn: '',
        });

    }
    return;
}
async function cekOut(finger, jadwal_dns) {
    console.log(finger);
    console.log(jadwal_dns.dataValues);
    let end_min = jadwal_dns.dataValues.dnsType.dataValues.end_min;
    let end_max = jadwal_dns.dataValues.dnsType.dataValues.end_max;
    let isCekOut = await Absen.findOne({
        where: {
            nik: jadwal_dns.dataValues.nik,
            date: finger.tanggal
        }
    });

    if (!isCekOut) {
        let statusout = checkPulang(finger.jam, end_min, end_max);
        let keteranganOut = '';
        if (statusout == 'Pulang Cepat') {
            let terlambat = hitungCepatPulang(finger.jam, end_min);
            keteranganOut += 'Pulang Cepat ' + terlambat + ' menit';
        }
        let absen = await Absen.create({
            nik: jadwal_dns.dataValues.nik,
            typeDns: jadwal_dns.dataValues.typeDns,
            date: finger.tanggal,
            cekIn: null,
            statusIn: null,
            keteranganIn: 'Tidak Absen Masuk',
            nilaiIn: 0,
            geoIn: '',
            loactionIn: '',
            visitIdIn: '',
            cekOut: finger.jam,
            statusOut: statusout,
            keteranganOut: keteranganOut,
            nilaiOut: 3,
            geoOut: '',
            loactionOut: finger.lokasi,
            visitIdOut: '',
        });
    }
    else {
        let statusout = checkPulang(finger.jam, end_min, end_max);
        let keteranganOut = '';
        if (statusout == 'Pulang Cepat') {
            let terlambat = hitungMenitTerlambat(finger.jam, end_min);
            keteranganOut += 'Pulang Cepat ' + terlambat + ' menit';
        }
        let absen = await Absen.update({
            cekOut: finger.jam,
            statusOut: statusout,
            keteranganOut: keteranganOut,
            nilaiOut: 3,
            geoOut: '',
            loactionOut: finger.lokasi,
            visitIdOut: '',
        }, {
            where: {
                nik: jadwal_dns.dataValues.nik,
                date: finger.tanggal
            }
        });
    }
    return;
}
function checkAttendance(jam, start_min, start_max) {
    const toDate = (timeStr) => new Date(`1970-01-01T${timeStr}Z`);

    const time = toDate(jam);
    const min = toDate(start_min);
    const max = toDate(start_max);

    if (time < min) {
        return 'Masuk Cepat';
    } else if (time >= min && time <= max) {
        return 'Masuk Tepat Waktu';
    } else {
        return 'Masuk Terlambat';
    }
}

function checkPulang(jam_pulang, end_min, end_max) {
    const toDate = (timeStr) => new Date(`1970-01-01T${timeStr}Z`);

    const time = toDate(jam_pulang);
    const min = toDate(end_min);
    const max = toDate(end_max);

    if (time < min) {
        return 'Pulang Cepat';
    } else if (time >= min && time <= max) {
        return 'Pulang Tepat Waktu';
    } else {
        return 'Pulang Terlambat';
    }
}


function hitungMenitTerlambat(jam, start_max) {
    const toDate = (timeStr) => new Date(`1970-01-01T${timeStr}Z`);
    const time = toDate(jam);
    const max = toDate(start_max);
    const diffMs = time - max;

    if (diffMs <= 0) {
        return 0; // Tidak terlambat
    }
    return Math.floor(diffMs / 60000); // Konversi ms ke menit
}

// console.log(hitungMenitTerlambat('20:09:31', '08:00:00'));

function hitungCepatPulang(jam, end_min) {
    const toDate = (timeStr) => new Date(`1970-01-01T${timeStr}Z`);

    const time = toDate(jam);
    const min = toDate(end_min);

    const diffMs = min - time;

    if (diffMs <= 0) {
        return 0; // Tidak cepat pulang
    }

    return Math.floor(diffMs / 60000); // Konversi ms ke menit
}