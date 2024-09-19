'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cuti_approval extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cuti_approval.hasOne(models.User, {
        foreignKey: 'nik',
        sourceKey: 'nik',
        as: 'atasan'
      })
      Cuti_approval.hasOne(models.Cuti, {
        foreignKey: 'id',
        sourceKey: 'id_cuti',
        as: 'data_cuti'
      })
    }
  }
  Cuti_approval.init({
    id_cuti: DataTypes.INTEGER,
    nik: DataTypes.BIGINT,
    departement: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    pangkat: DataTypes.STRING,
    approve_date: DataTypes.DATE,
    status: DataTypes.ENUM('Disetujui', 'Ditolak', 'Menunggu', 'Perubahan', 'Ditangguhkan', 'Tidak Disetujui'),
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cuti_approval',
  });
  return Cuti_approval;
};