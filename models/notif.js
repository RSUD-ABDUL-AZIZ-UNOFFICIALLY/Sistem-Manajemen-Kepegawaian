'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notif extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notif.init({
    user: DataTypes.BIGINT(16),
    status: DataTypes.ENUM('AKTIF', 'PENSIUN'),
    whatsapp: DataTypes.ENUM('0','1'),
    email: DataTypes.ENUM('0','1')
  }, {
    sequelize,
    modelName: 'Notif',
  });
  return Notif;
};