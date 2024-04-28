'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ledger_cuti extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Ledger_cuti.hasOne(models.User, {
                foreignKey: 'nik',
                sourceKey: 'nik_user',
                as: 'User_cuti'
            }, {
                foreignKey: 'nik',
                sourceKey: 'nik_atasan',
                as: 'Atasan_cuti'
            })
            Ledger_cuti.hasOne(models.User, {
                foreignKey: 'nik',
                sourceKey: 'nik_atasan',
                as: 'Atasan_cuti'
            })
            Ledger_cuti.hasOne(models.Jns_cuti, {
                foreignKey: 'id',
                sourceKey: 'type_cuti',
                as: 'jenis_cuti'
            })
            Ledger_cuti.hasOne(models.Cuti, {
                foreignKey: 'id',
                sourceKey: 'id_cuti',
                as: 'data_cuti'
            })
            Ledger_cuti.hasOne(models.Cuti_approval, {
                foreignKey: 'id_cuti',
                sourceKey: 'id_cuti',
                as: 'approval_cuti'
            })
        }
    }
    Ledger_cuti.init({
        nik_user: DataTypes.BIGINT,
        name_user: DataTypes.STRING,
        pangkat: DataTypes.STRING,
        jabatan: DataTypes.STRING,
        departemen: DataTypes.STRING,
        nik_atasan: DataTypes.BIGINT,
        name_atasan: DataTypes.STRING,
        tembusan: DataTypes.STRING,
        periode: DataTypes.INTEGER,
        type_cuti: DataTypes.INTEGER,
        id_cuti: DataTypes.INTEGER,
        sisa_cuti: DataTypes.INTEGER,
        cuti_diambil: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Ledger_cuti',
    });
    return Ledger_cuti;
};