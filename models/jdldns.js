'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jdldns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Jdldns.hasOne(models.Jnsdns, {
        foreignKey: 'slug',
        sourceKey: 'typeDns',
        as: 'dnsType'
      })
    }
  }
  Jdldns.init({
    nik: DataTypes.INTEGER,
    typeDns: DataTypes.STRING,
    date: DataTypes.DATEONLY,
  }, {
    sequelize,
    modelName: 'Jdldns',
  });
  return Jdldns;
};