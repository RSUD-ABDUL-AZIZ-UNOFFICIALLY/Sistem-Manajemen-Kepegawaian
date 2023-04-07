'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lpkp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lpkp.init({
    nik: DataTypes.INTEGER,
    rak: DataTypes.STRING,
    tgl: DataTypes.DATE,
    volume: DataTypes.INTEGER,
    satuan: DataTypes.ENUM('Dokumen', 'Laporan', '-'),
    waktu: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Lpkp',
  });
  return Lpkp;
};