'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Biodatas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Biodatas.init({
    nik: DataTypes.BIGINT,
    alamat: DataTypes.STRING,
    pangkat: DataTypes.STRING,
    tmt_pangkat: DataTypes.DATEONLY,
    marital: DataTypes.STRING,
    golongan_darah: DataTypes.ENUM('A', 'B', 'AB', 'O'),
    tmt_kerja: DataTypes.DATEONLY,
    jns_kerja: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Biodatas',
  });
  return Biodatas;
};