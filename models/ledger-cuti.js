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
                foreignKey: 'nik_user',
                targetKey: 'nik',
                as: 'user'
            })
            Ledger_cuti.hasOne(models.User, {
                foreignKey: 'nik_atasan',
                targetKey: 'nik',
                as: 'atasan'
            })
            Ledger_cuti.hasOne(models.Jns_cuti, {
                foreignKey: 'type_cuti',
                targetKey: 'id',
                as: 'jenis_cuti'
            })
            Ledger_cuti.hasOne(models.Cuti, {
                foreignKey: 'id_cuti',
                targetKey: 'id',
                as: 'data_cuti'
            })
        }
    }
    Ledger_cuti.init({
        nik_user: DataTypes.BIGINT,
        nik_atasan: DataTypes.BIGINT,
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