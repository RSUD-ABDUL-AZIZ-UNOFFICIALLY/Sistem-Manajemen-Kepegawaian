'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pasien extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pasien.init({
    nik: DataTypes.BIGINT,
    fullname: DataTypes.STRING,
    wa: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pasien',
  });
  return Pasien;
};