const { Absen, Dump_Absen, Mesin_Absen, Maps_Absen, Jdldns, Jnsdns, sequelize } = require("../models");
const { Op, or } = require("sequelize");
async function cekOLD(nik, dnsType, dateStart, dateEnd, timestart, timeend) {
    let jadawldns = await Jdldns.findAll({
        where: {
            nik: nik,
            typeDns: dnsType,
            date: {
                [Op.between]: [dateStart, dateEnd]
            }
        },
        order: [
            ['date', 'ASC']
        ]
    })
    for (let i of jadawldns) {
        let isexist = await Absen.findOne({
            where: {
                nik: nik,
                date: i.date
            }
        })
        let cheinTime = getRandomTime(timestart, timeend)
        if (isexist){
            if (isexist.cekIn == null) {
                await Absen.update({
                    cekIn: cheinTime,
                    statusIn: 'Masuk Tepat Waktu',
                    keteranganIn: '',
                    nilaiIn: 2,
                    geoIn: '',
                    loactionIn: 'LOBBY IGD',
                    visitIdIn: '',
                }, {
                    where: {
                        nik: nik,
                        date: i.date
                    }
                })
                
            }else{
                continue
            }
        }else{
            let absenIn = {
                nik: nik,
                typeDns: dnsType,
                date: i.date,
                cekIn: cheinTime,
                statusIn: 'Masuk Tepat Waktu',
                keteranganIn: '',
                nilaiIn: 2,
                geoIn: '',
                loactionIn: 'LOBBY IGD',
                visitIdIn: '',
            }
            console.log(absenIn);
            let absen = await Absen.create(absenIn);
        }
        // return
    }
    
}

async function outOLD(nik, dnsType, dateStart, dateEnd, timestart, timeend) {
    let jadawldns = await Jdldns.findAll({
        where: {
            nik: nik,
            typeDns: dnsType,
            date: {
                [Op.between]: [dateStart, dateEnd]
            }
        },
        order: [
            ['date', 'ASC']
        ]
    })
    for (let i of jadawldns) {
        let isexist = await Absen.findOne({
            where: {
                nik: nik,
                date: i.date
            }
        })
        let cekOut = getRandomTime(timestart, timeend)
        console.log(cekOut);
        if (isexist) {
            if (isexist.cekOut == null) {
               let da= await Absen.update({
                    cekOut: cekOut,
                    statusOut: 'Pulang Tepat Waktu',
                    keteranganOut: '',
                    nilaiOut: 2,
                    geoOut: '',
                    loactionOut: 'LOBBY IGD',
                    visitIdOut: '',
                }, {
                    where: {
                        nik: nik,
                        date: i.date
                    }
                })
                console.log(da);

            } else {
                continue
            }
        } 
        // return
    }

}
// outOLD('6172016010880001', 'Senin-Kamis-43', '2026-02-01', '2026-02-18', '16:00:00', '17:30:00');
// outOLD('6172026601720001', 'Jumaat-2', '2026-02-01', '2026-02-18', '16:00:00', '17:30:00');
// outOLD('6172016010880001', 'Senin-Kamis-43', '2026-02-19', '2026-02-28', '14:30:00', '16:00:00');
// outOLD('6172025810760001', 'Jumaat-2', '2026-02-19', '2026-02-28', '14:30:00', '16:00:00');
cekOLD('6106015905820003', 'Senin-Kamis-12', '2026-02-01', '2026-02-28', '06:30:00', '07:00:00');
// cekOLD('6106015905820003', 'Jumaat-12', '2026-02-01', '2026-02-28', '06:30:00', '07:00:00');
cekOLD('6106015905820003', 'Sabtu-12', '2026-02-01', '2026-02-28', '06:30:00', '07:00:00');


function getRandomTime(start, end) {
    // We use a fixed date (today) to normalize the time strings into Date objects
    const datePrefix = '2024-01-01 ';

    const startTime = new Date(datePrefix + start).getTime();
    const endTime = new Date(datePrefix + end).getTime();

    // Calculate a random timestamp between start and end
    const randomTimestamp = startTime + Math.random() * (endTime - startTime);
    const randomDate = new Date(randomTimestamp);

    // Format to HH:MM:SS with leading zeros
    const hours = String(randomDate.getHours()).padStart(2, '0');
    const minutes = String(randomDate.getMinutes()).padStart(2, '0');
    const seconds = String(randomDate.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

// console.log(getRandomTime('07:00:00','07:30:00'));

