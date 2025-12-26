'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skck extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Skck.init({
    skck_number: DataTypes.STRING,
    skck_issuer: DataTypes.STRING,
    skck_issue_date: DataTypes.DATEONLY,
    skck_purpose: DataTypes.STRING,
    catatan: DataTypes.STRING,
    status: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    nik: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Skck',
  });
  return Skck;
};