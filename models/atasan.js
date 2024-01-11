'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Atasan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Atasan.hasOne(models.User, {
        foreignKey: 'id',
        as: 'bio'
      });
      Atasan.hasOne(models.User, {
        foreignKey: 'nik',
        sourceKey: 'bos',
        as: 'atasanLangsung'
      })

    }
  }
  Atasan.init({
    user: DataTypes.INTEGER,
    bos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Atasan',
  });
  return Atasan;
};