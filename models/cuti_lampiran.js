'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuti_lampiran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cuti_lampiran.init({
    nik: DataTypes.INTEGER,
    id_cuti: DataTypes.INTEGER,
    file: DataTypes.STRING,
    periode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cuti_lampiran',
  });
  return Cuti_lampiran;
};