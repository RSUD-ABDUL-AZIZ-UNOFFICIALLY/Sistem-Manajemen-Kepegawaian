'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuti_sisa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cuti_sisa.init({
    nik: DataTypes.INTEGER,
    periode: DataTypes.INTEGER,
    sisa: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cuti_sisa',
  });
  return Cuti_sisa;
};