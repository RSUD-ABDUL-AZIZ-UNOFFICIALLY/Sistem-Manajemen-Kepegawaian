const {
    User,
    Biodatas,
    Atasan,
    Lpkp,
    Rekap,
    Aprovement,
    Template,
    Departemen,
    Profile,
    Jns_cuti,
    Cuti,
    Cutialamat,
    Ledger_cuti,
    sequelize,
    Cuti_approval,
    Cuti_lampiran,
    Access,
    Hotspot,
    Instalasi
} = require("../models");
const { Op, or } = require("sequelize");

async function approval(nik, id_cuti, periode) {
    let t = await sequelize.transaction();
    try {
        let getCuti = await Cuti.findOne({
            where: {
                id: id_cuti,
            },
            include: [
                {
                    model: Jns_cuti,
                    as: "jenis_cuti",
                },
                {
                    model: User,
                    as: "user",
                    include: [
                        {
                            model: Biodatas,
                            as: "biodata",
                        },
                        {
                            model: Departemen,
                            as: "departemen",
                        }
                    ],
                },
            ],
        });
        let atasan = await User.findOne({
            where: {
                nik: nik,
            },
            include: [
                {
                    model: Departemen,
                    as: "departemen",
                }
            ],
        });
        let ledger = await Ledger_cuti.findOne({
            where: {
                nik_user: getCuti.nik,
                type_cuti: getCuti.type_cuti,
                periode: parseInt(periode),
            },
            order: [
                ["createdAt", "DESC"],
            ],
        }, { transaction: t });
        if (ledger == null) {
            let sisaCuti = getCuti.jenis_cuti.total - getCuti.jumlah;
            await Ledger_cuti.create({
                nik_user: getCuti.nik,
                name_user: getCuti.user.nama,
                jabatan: getCuti.user.jab,
                pangkat: getCuti.user.biodata.pangkat,
                departemen: getCuti.user.departemen.bidang,
                nik_atasan: atasan.nik,
                name_atasan: atasan.nama,
                tembusan: atasan.departemen.bidang,
                periode: parseInt(periode),
                type_cuti: getCuti.type_cuti,
                id_cuti: getCuti.id,
                sisa_cuti: sisaCuti,
                cuti_diambil: getCuti.jumlah,
            }, { transaction: t });
        } else {
            let sisaCuti = ledger.sisa_cuti - getCuti.jumlah;
            if (sisaCuti < 0) {
                console.log("Sisa cuti tidak mencukupi");
                return await t.rollback();
                // return res.status(400).json({
                //     error: true,
                //     message: "error",
                //     data: "Sisa cuti tidak mencukupi",
                // });
            }
            await Ledger_cuti.create({
                nik_user: getCuti.nik,
                name_user: getCuti.user.nama,
                jabatan: getCuti.user.jab,
                pangkat: getCuti.user.biodata.pangkat,
                departemen: getCuti.user.departemen.bidang,
                nik_atasan: atasan.nik,
                name_atasan: atasan.nama,
                tembusan: atasan.departemen.bidang,
                periode: parseInt(periode),
                type_cuti: getCuti.type_cuti,
                id_cuti: getCuti.id,
                sisa_cuti: sisaCuti,
                cuti_diambil: getCuti.jumlah,
            },
                { transaction: t });
        }
        let timeNowWib = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
        });
        await Cuti_approval.update(
            {
                status: "Disetujui",
                keterangan: "Disetujui Oleh Sistem",
                approve_date: timeNowWib,
            },
            {
                where: {
                    id: id_cuti,
                    nik: nik,
                },
            },
            { transaction: t });
        await t.commit();

    } catch (error) {
        await t.rollback();
        console.log(error);
    }

}
// approval("6172017001950001", 1260, 2024);

async function findBelumDiApprove() {
    let dataApproval = await Cuti_approval.findAll({
        where: {
            status: "Menunggu",
            createdAt: {
                [Op.startsWith]: "2024",
            },
        },
        // include: [
        //     {
        //         model: Cuti,
        //         as: "cuti",
        //     },
        //     {
        //         model: User,
        //         as: "atasan",
        //     },
        // ],
    });
    for (let e of dataApproval) {
        console.log(e.dataValues.nik, e.dataValues.id_cuti);
        await approval(e.dataValues.nik, e.dataValues.id_cuti, 2025);
    }
    console.log(dataApproval.length);
    return dataApproval;
}
// findBelumDiApprove();