'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lainnya extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lainnya.init({
    document_name: DataTypes.STRING,
    other_description: DataTypes.STRING,
    document_date: DataTypes.DATEONLY,
    document_issuer: DataTypes.STRING,
    catatan: DataTypes.STRING,
    status: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    nik: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Lainnya',
  });
  return Lainnya;
};