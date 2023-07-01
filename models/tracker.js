'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tracker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tracker.init({
    nik: DataTypes.BIGINT,
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
    modelName: 'Tracker',
  });
  return Tracker;
};