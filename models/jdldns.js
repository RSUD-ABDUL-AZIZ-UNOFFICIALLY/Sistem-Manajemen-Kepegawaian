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
      Jdldns.hasOne(models.Absen, {
        foreignKey: 'nik',
        sourceKey: 'nik',
        as: 'absen',
        constraints: false //
      })
      Jdldns.hasOne(models.Maps_Absen, {
        foreignKey: 'nik',
        sourceKey: 'nik',
        as: 'id_finger'
      })
      Jdldns.hasOne(models.User, {
        foreignKey: 'nik',
        sourceKey: 'nik',
        as: 'user'
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