'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lastseen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lastseen.init({
    nik: DataTypes.BIGINT,
    visite: DataTypes.STRING,
    name: DataTypes.STRING,
    state: DataTypes.STRING,
    userAgent: DataTypes.STRING,
    vendor: DataTypes.STRING,
    os: DataTypes.STRING,
    ip: DataTypes.STRING,
    as: DataTypes.STRING,
    isp: DataTypes.STRING,
    city: DataTypes.STRING,
    batteryLevel: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Lastseen',
  });
  return Lastseen;
};