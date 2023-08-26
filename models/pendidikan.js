'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pendidikan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pendidikan.init({
    nik: DataTypes.BIGINT,
    tingakt: DataTypes.STRING,
    jurusan: DataTypes.STRING,
    sekolah: DataTypes.STRING,
    tempat: DataTypes.STRING,
    nomor_ijazah: DataTypes.STRING,
    tahun_lulus: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Pendidikan',
  });
  return Pendidikan;
};