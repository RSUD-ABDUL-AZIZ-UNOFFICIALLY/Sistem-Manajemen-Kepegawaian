'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Aprovement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Aprovement.init({
    nik: DataTypes.INTEGER,
    bos: DataTypes.INTEGER,
    tglberkas: DataTypes.DATEONLY,
    status_aprove: DataTypes.ENUM('true', 'false')
  }, {
    sequelize,
    modelName: 'Aprovement',
  });
  return Aprovement;
};