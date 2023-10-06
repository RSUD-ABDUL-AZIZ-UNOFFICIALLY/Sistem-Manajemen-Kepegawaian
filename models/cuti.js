'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuti extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cuti.hasOne(models.Jns_cuti, {
        foreignKey: 'id',
        sourceKey: 'type_cuti',
        as: 'jenis_cuti'
      })
      Cuti.hasOne(models.Cuti_approval, {
        foreignKey: 'id_cuti',
        sourceKey: 'id',
        as: 'approval'
      })
      Cuti.hasOne(models.User, {
        foreignKey: 'nik',
        sourceKey: 'nik',
        as: 'user'
      })
    }
  }
  Cuti.init({
    nik: DataTypes.BIGINT(16),
    type_cuti: DataTypes.INTEGER,
    mulai: DataTypes.DATEONLY,
    samapi: DataTypes.DATEONLY,
    jumlah: DataTypes.INTEGER,
    keterangan: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Cuti',
  });
  return Cuti;
};