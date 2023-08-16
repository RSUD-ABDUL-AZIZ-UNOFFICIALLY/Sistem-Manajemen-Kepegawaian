'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jns_cuti extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Jns_cuti.init({
    type_cuti: DataTypes.STRING,
    max: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    status: DataTypes.ENUM('PNS', 'PPPK', 'Non ASN')
  }, {
    sequelize,
    modelName: 'Jns_cuti',
  });
  return Jns_cuti;
};