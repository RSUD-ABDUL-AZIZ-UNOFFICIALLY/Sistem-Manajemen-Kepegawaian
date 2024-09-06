'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instalasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Instalasi.hasOne(models.User, {
        foreignKey: 'nik',
        sourceKey: 'bos',
        as: 'atasan'
      })

    }
  }
  Instalasi.init({
    bos: DataTypes.INTEGER,
    dep: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Instalasi',
  });
  return Instalasi;
};