'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuti extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Cuti.init({
    nik: DataTypes.BIGINT,
    max: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    status: DataTypes.ENUM('PNS', 'PPPK', 'Non ASN')
  }, {
    sequelize,
    modelName: 'Cuti',
  });
  return Cuti;
};