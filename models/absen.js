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
    }
  }
  Absen.init({
    nik: DataTypes.BIGINT(16),
    typeDns: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    cekIn: DataTypes.TIME,
    statusIn: DataTypes.ENUM('Late', 'On Time', 'Absent'),
    keteranganIn: DataTypes.STRING,
    nilaiIn: DataTypes.INTEGER,
    geoIn: DataTypes.STRING,
    visitIdIn: DataTypes.STRING,
    cekOut: DataTypes.TIME,
    statusOut: DataTypes.ENUM('Late', 'On Time', 'Absent'),
    keteranganOut: DataTypes.STRING,
    nilaiOut: DataTypes.INTEGER,
    geoOut: DataTypes.STRING,
    visitIdOut: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Absen',
  });
  return Absen;
};