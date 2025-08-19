'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ktp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ktp.init({
    ktp_number: DataTypes.STRING,
    ktp_name: DataTypes.STRING,
    birth_place: DataTypes.STRING,
    birth_date: DataTypes.DATEONLY,
    ktp_address: DataTypes.STRING,
    ktp_issue_date: DataTypes.DATEONLY,
    catatan: DataTypes.STRING,
    status: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    nik: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Ktp',
  });
  return Ktp;
};