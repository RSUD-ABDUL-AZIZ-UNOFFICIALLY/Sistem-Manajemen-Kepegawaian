const { sequelize, User, Departemen, Biodatas, Atasan, Cuti_sisa, Cuti, Cuti_approval, Ledger_cuti } = require("../models");
const { Op, where } = require("sequelize");

async function addcuti(nik, jumlah, tahun, type) {
    let t = await sequelize.transaction();
    let zerodate = new Date(8.64e15).toString()
    console.log(zerodate)
    try {
        let addsisaCuti = await Cuti_sisa.create({
            nik: nik,
            periode: tahun,
            sisa: jumlah
        }, { transaction: t });
        let dateup = addsisaCuti.updatedAt;
        let addcuti = await Cuti.create({
            nik: nik,
            type_cuti: type,

            jumlah: jumlah,
            keterangan: `TAMBAHAN CUTI ${tahun} `,
        }, { transaction: t })

        await Cuti_approval.create({
            id_cuti: addcuti.dataValues.id,
            nik: nik,
            departement: null,
            jabatan: null,
            pangkat: null,
            approve_date: dateup,
            status: 'Disetujui',
            keterangan: `TAMBAHAN CUTI ${tahun} `
        }, { transaction: t })

        let ledger = await Ledger_cuti.findOne({
            where: {
                nik_user: nik,
                type_cuti: type,
            },
            order: [
                ["sisa_cuti", "ASC"]
            ]
        })
        if (ledger) {
            let addLeager = await Ledger_cuti.create({
                nik_user: nik,
                name_user: 'Fakhry Hizballah Al Muminurradian S.T',
                pangkat: '',
                jabatan: 'Pengelola Teknologi Informasi',
                departemen: 'Bagian Umum dan Kepegawaian',
                nik_atasan: 6172026104860002,
                name_atasan: 'F. FILICITY YOSSY KARTINI, S.S., M.A.P',
                tembusan: 'Bagian Umum dan Kepegawaian',
                periode: tahun + 1,
                type_cuti: type,
                id_cuti: addcuti.dataValues.id,
                sisa_cuti: 3 + jumlah,
                cuti_diambil: jumlah
            }, { transaction: t })
            console.log(addLeager);

        } else {
            let userData = await User.findOne({
                where: {
                    nik: nik
                },
                include: [
                    {
                        model: Departemen,
                        as: "departemen",
                    },
                    {
                        model: Biodatas,
                        as: "biodata",
                    },
                ]
            })

            let Boss = await Atasan.findOne({
                where: {
                    user: nik,
                },
                include: [
                    {
                        model: User,
                        as: "atasanLangsung",
                        include: [
                            {
                                model: Departemen,
                                as: "departemen",
                            },
                        ],
                    },
                ],
            }, { transaction: t });
            await Ledger_cuti.create({
                nik_user: nik,
                name_user: userData.dataValues.nama,
                pangkat: userData.biodata.pangkat,
                jabatan: userData.dataValues.jab,
                departemen: userData.departemen.bidang,
                nik_atasan: Boss.bos,
                name_atasan: Boss.atasanLangsung.nama,
                tembusan: Boss.atasanLangsung.jab,
                periode: tahun + 1,
                type_cuti: type,
                id_cuti: addcuti.dataValues.id,
                sisa_cuti: 12 + jumlah,
                cuti_diambil: jumlah
            }, { transaction: t })
        }
        await t.commit();
        //     console.log(addsisaCuti)
        // console.log(addsisaCuti.updatedAt)

    } catch (error) {
        console.log(error)
        await t.rollback();

    }


    return;

}
addcuti(6172040104000002, 6, 2023, 3)