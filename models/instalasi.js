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
      Instalasi.hasOne(models.Departemen, {
        foreignKey: 'id',
        sourceKey: 'dep',
        as: 'departemen'
      })
      Instalasi.hasMany(models.User, {
        foreignKey: 'dep',
        sourceKey: 'dep',
        as: 'anggota'
      })

    }
  }
  Instalasi.init({
    bos: DataTypes.INTEGER,
    dep: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Instalasi',
  });
  return Instalasi;
};