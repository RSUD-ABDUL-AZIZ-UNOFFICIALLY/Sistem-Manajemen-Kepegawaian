'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuti_approval extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Cuti_approval.init({
    nik: DataTypes.BIGINT,
    type_cuti: DataTypes.INTEGER,
    mulai: DataTypes.DATEONLY,
    sampai: DataTypes.DATEONLY,
    jumlah: DataTypes.INTEGER,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cuti_approval',
  });
  return Cuti_approval;
};