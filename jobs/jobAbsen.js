const { Absen, Dump_Absen, Mesin_Absen, Maps_Absen, Jdldns, Jnsdns, sequelize } = require("../models");
const { Op, where } = require("sequelize");
const cron = require('node-cron');
const axios = require("axios");
// require('dotenv').config();
// cekIn('2025-04-16');
cekOut('2025-04-16');
console.log(process.env.HOST_FIGER);

cron.schedule('*/2 * * * *', () => {
    let onlyDate = new Date().toISOString().slice(0, 10);
    // let date = onlyDate.slice(5, 10);
    console.log(onlyDate + ' cekIn');
    cekIn(onlyDate);
    console.log(onlyDate);
});
cron.schedule('*/11 * * * *', () => {
    let onlyDate = new Date().toISOString().slice(0, 10);
    // let date = onlyDate.slice(5, 10);
    console.log(onlyDate + ' cekOut');
    cekOut(onlyDate);
});

async function cekIn(date) {
    let find_jdl = await Jdldns.findAll({
        where: {
            date: date
        },
        include: [{
            model: Jnsdns,
            as: 'dnsType',
            attributes: ['start_min', 'start_max', 'end_min', 'end_max'],
            where: {
                state: 1
            }

        },{
            model: Absen,
            as: 'absen',
            where: {
                date: date
            },
            required: false,
        },{
            model: Maps_Absen,
            as: 'id_finger',
            attributes: ['id_finger'],
            required: true,
        }]
    });
    let find_jdls = find_jdl.filter(item => item.absen == null);
    let idFinger = find_jdls.map(item => item.id_finger.id_finger);
    console.log(idFinger);
    if (idFinger.length == 0) {
        console.log("tidak ada data");
        return;
    }
      let config = {
            method: 'get',
            maxBodyLength: Infinity,
          url: process.env.HOST_FIGER + '/absensi?month=' + date,
          data: idFinger
        };
        let res = await axios(config)
    res.data.forEach(item => item.badgenumber = parseInt(item.badgenumber));
  
    // console.log(res.data[0]);
    console.log(find_jdls.length);
    console.log(res.data);
    for (let i of find_jdls) {
        console.log(i.id_finger.id_finger);
        let data_absen = res.data.filter(item => item.badgenumber == i.id_finger.id_finger && item.checktype == 0);
        console.log(data_absen);
        if (data_absen.length == 0) {
            console.log("tidak ada data");
            continue;
        }

        let statusin = checkAttendance(data_absen[0].checktime_wib.jam, i.dnsType.start_min, i.dnsType.start_max);
        console.log(statusin);
        let keteranganIn = '';
        if (statusin == 'Masuk Terlambat') {
            let terlambat = hitungMenitTerlambat(data_absen[0].checktime_wib.jam, i.dnsType.start_max);
            keteranganIn += 'Terlambat ' + terlambat + ' menit';
        }
        console.log(i.dataValues);
        let absenIn = {
            nik: i.dataValues.nik,
            typeDns: i.typeDns,
            date: data_absen[0].checktime_wib.tanggal,
            cekIn: data_absen[0].checktime_wib.jam,
            statusIn: statusin,
            keteranganIn: keteranganIn,
            nilaiIn: 3,
            geoIn: '',
            loactionIn: data_absen[0].Alias,
            visitIdIn: '',
        }
        console.log(absenIn);
        let absen = await Absen.create(absenIn);
        console.log(absen);
        // return
    }

}

async function cekOut(date) {
    let find_jdl = await Jdldns.findAll({
        where: {
            date: date
        },
        include: [{
            model: Jnsdns,
            as: 'dnsType',
            attributes: ['start_min', 'start_max', 'end_min', 'end_max'],
            where: {
                state: 1
            }

        }, {
            model: Absen,
            as: 'absen',
            where: {
                date: date
            },
            required: false,
        }, {
            model: Maps_Absen,
            as: 'id_finger',
            attributes: ['id_finger'],
            required: true,
        }]
    });
    let idFinger = find_jdl.map(item => item.id_finger.id_finger);
    console.log(idFinger);
    if (idFinger.length == 0) {
        console.log("tidak ada data");
        return;
    }
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.HOST_FIGER + '/absensi?month=' + date,
        data: idFinger
    };
    let res = await axios(config)
    res.data.forEach(item => item.badgenumber = parseInt(item.badgenumber));

    let belum_absenMasuk = find_jdl.filter(item => item.absen == null);
    let belum_absenPulang = find_jdl.filter(item => item.absen != null && item.absen.statusOut == null);


    for (let i of belum_absenPulang) {
        let data_absen = res.data.filter(item => item.badgenumber == i.id_finger.id_finger && item.checktype == 1);
        if (data_absen.length == 0) {
            console.log("tidak ada data");
            continue;
        }

        let hasil = evaluasiPulang(data_absen, i.dnsType.end_min, i.dnsType.end_max);
        if (!hasil) continue;

        let statusout = hasil.statusout;
        let keteranganOut = hasil.keteranganOut;
        let jamPulang = hasil.checktime;
               let absen = await Absen.update({
                   cekOut: jamPulang,
                   statusOut: statusout,
                   keteranganOut: keteranganOut,
                   nilaiOut: 3,
                   geoOut: '',
                   loactionOut: data_absen[0].Alias,
                   visitIdOut: '',
               }, {
                   where: {
                       id: i.absen.id
                   }
               });
    }
    for (let i of belum_absenMasuk){
        let data_absen = res.data.filter(item => item.badgenumber == i.id_finger.id_finger && item.checktype == 1);
        if (data_absen.length == 0) {
            console.log("tidak ada data");
            continue;
        }

        let hasil = evaluasiPulang(data_absen, i.dnsType.end_min, i.dnsType.end_max);
        if (!hasil) continue;

        let statusout = hasil.statusout;
        let keteranganOut = hasil.keteranganOut;
        let jamPulang = hasil.checktime;

        let absen = await Absen.create({
            nik: i.dataValues.nik,
            typeDns: i.typeDns,
            date: data_absen[0].checktime_wib.tanggal,
            cekIn: null,
            statusIn: null,
            keteranganIn: 'Tidak Absen Masuk',
            nilaiIn: 0,
            geoIn: '',
            loactionIn: '',
            visitIdIn: '',
            cekOut: jamPulang,
            statusOut: statusout,
            keteranganOut: keteranganOut,
            nilaiOut: 3,
            geoOut: '',
            loactionOut: data_absen[0].Alias,
            visitIdOut: '',
        });

    }
    console.log(find_jdl.length)
    console.log(belum_absenMasuk.length)
    console.log(belum_absenPulang.length)

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
function evaluasiPulang(data_absen, end_min, end_max) {
    let awal = data_absen[0];
    let akhir = data_absen[data_absen.length - 1];

    let statusAwal = checkPulang(awal.checktime_wib.jam, end_min, end_max);
    let menitAwal = hitungCepatPulang(awal.checktime_wib.jam, end_min);

    if (statusAwal === 'Pulang Cepat' && menitAwal > 150) {
        let statusAkhir = checkPulang(akhir.checktime_wib.jam, end_min, end_max);
        let menitAkhir = hitungCepatPulang(akhir.checktime_wib.jam, end_min);
        if (statusAkhir === 'Pulang Cepat' && menitAkhir > 150) {
            return null; // tidak valid
        }
        return {
            statusout: statusAkhir,
            keteranganOut: menitAkhir > 0 ? `Pulang Cepat ${menitAkhir} menit` : '',
            checktime: akhir.checktime_wib.jam,
        };
    }

    return {
        statusout: statusAwal,
        keteranganOut: menitAwal > 0 ? `Pulang Cepat ${menitAwal} menit` : '',
        checktime: awal.checktime_wib.jam
    };
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