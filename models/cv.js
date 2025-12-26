'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cv extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cv.init({
    cv_version: DataTypes.STRING,
    cv_description: DataTypes.STRING,
    catatan: DataTypes.STRING,
    status: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    nik: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Cv',
  });
  return Cv;
};