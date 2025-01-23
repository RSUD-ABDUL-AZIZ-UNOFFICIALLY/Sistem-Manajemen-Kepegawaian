'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Absen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Absen.hasOne(models.Jnsdns, {
        foreignKey: 'slug',
        sourceKey: 'typeDns'
      })
      // Atasan.hasOne(models.User, {
      //   foreignKey: 'nik',
      //   sourceKey: 'bos',
      //   as: 'atasanLangsung'
      // })

    }
  }
  Absen.init({
    nik: DataTypes.BIGINT(16),
    typeDns: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    cekIn: DataTypes.TIME,
    statusIn: DataTypes.ENUM('Masuk Cepat', 'Masuk Terlambat', 'Masuk Tepat Waktu'),
    keteranganIn: DataTypes.STRING,
    nilaiIn: DataTypes.INTEGER,
    geoIn: DataTypes.STRING,
    loactionIn: DataTypes.STRING,
    visitIdIn: DataTypes.STRING,
    cekOut: DataTypes.TIME,
    statusOut: DataTypes.ENUM('Pulang Cepat', 'Pulang Terlambat', 'Pulang Tepat Waktu'),
    keteranganOut: DataTypes.STRING,
    nilaiOut: DataTypes.INTEGER,
    geoOut: DataTypes.STRING,
    visitIdOut: DataTypes.STRING,
    loactionOut: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Absen',
  });
  return Absen;
};