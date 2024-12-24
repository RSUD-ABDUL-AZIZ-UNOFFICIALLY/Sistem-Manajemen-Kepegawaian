'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jnsdns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Jnsdns.init({
    type: DataTypes.STRING,
    slug: DataTypes.STRING,
    dep: DataTypes.INTEGER,
    day: DataTypes.STRING,
    start_min: DataTypes.TIME,
    start_max: DataTypes.TIME,
    end_min: DataTypes.TIME,
    end_max: DataTypes.TIME,
    state: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Jnsdns',
  });
  return Jnsdns;
};