'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Str extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Str.init({
    str_number: DataTypes.STRING,
    profession: DataTypes.STRING,
    issue_date: DataTypes.DATEONLY,
    expiry_date: DataTypes.DATEONLY,
    issuer: DataTypes.STRING,
    catatan: DataTypes.STRING,
    status: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    nik: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Str',
  });
  return Str;
};