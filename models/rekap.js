'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rekap extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Rekap.belongsTo(models.User, {
        foreignKey: 'nik',
        as: 'user'
      })
    }
  }
  Rekap.init({
    nik: DataTypes.INTEGER,
    capaian: DataTypes.INTEGER,
    kategori: DataTypes.ENUM('BAIK', 'CUKUP', 'KURANG','WKE MINIMAL TIDAK TERPENUHI'),
    tpp: DataTypes.INTEGER,
    ket: DataTypes.STRING,
    periode: DataTypes.DATE,
    dep: DataTypes.STRING,
    jab: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rekap',
  });
  return Rekap;
};