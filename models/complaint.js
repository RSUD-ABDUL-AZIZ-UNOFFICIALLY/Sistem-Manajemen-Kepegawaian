'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Complaint extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Complaint.belongsTo(models.Tiket, {
        foreignKey: 'noTiket',
        as: 'tiket'
      }),
      Complaint.hasOne(models.User, {
        foreignKey: 'nik',
        as: 'user'
      })
      Complaint.belongsTo(models.Departemen, {
        foreignKey: 'dep',
        as: 'departemen'
      })
    }
  }
  Complaint.init({
    noTiket: DataTypes.STRING,
    nik: DataTypes.BIGINT,
    nama: DataTypes.STRING,
    noHp: DataTypes.STRING,
    dep: DataTypes.INTEGER,
    topic: DataTypes.STRING,
    kendala: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Complaint',
  });
  return Complaint;
};