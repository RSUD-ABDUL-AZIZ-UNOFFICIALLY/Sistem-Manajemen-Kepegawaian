'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pangkat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pangkat.init({
    Pendidikan: DataTypes.STRING,
    gol_ruang: DataTypes.STRING,
    gol_ruang_tmt: DataTypes.DATEONLY,
    jabatan: DataTypes.STRING,
    jabatan_tmt: DataTypes.DATEONLY,
    document_date: DataTypes.DATEONLY,
    document_issuer: DataTypes.STRING,
    catatan: DataTypes.STRING,
    status: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    nik: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Pangkat',
  });
  return Pangkat;
};