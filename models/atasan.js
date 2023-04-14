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