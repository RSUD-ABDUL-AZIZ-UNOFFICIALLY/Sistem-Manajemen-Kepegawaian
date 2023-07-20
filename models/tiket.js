'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tiket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tiket.hasOne(models.Complaint, {
        foreignKey: 'noTiket',
        as: 'complain'
      })
    }
  }
  Tiket.init({
    noTiket: DataTypes.STRING,
    nama: DataTypes.STRING,
    status: DataTypes.STRING,
    keteranagn: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tiket',
  });
  return Tiket;
};