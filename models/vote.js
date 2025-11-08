'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Vote.hasOne(models.User, {
        foreignKey: 'nik',
        sourceKey: 'peserta',
        as: 'dataPeserta'
      })
      Vote.hasOne(models.User, {
        foreignKey: 'nik',
        sourceKey: 'pemilih',
        as: 'dataPemiih'
      })
    }
  }
  Vote.init({
    peserta: DataTypes.INTEGER,
    jns_kelamin: DataTypes.ENUM('Laki-laki', 'Perempuan'),
    pemilih: DataTypes.INTEGER,
    periode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Vote',
  });
  return Vote;
};