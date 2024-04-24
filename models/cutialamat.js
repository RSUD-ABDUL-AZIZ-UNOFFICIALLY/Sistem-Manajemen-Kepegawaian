'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cutialamat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Cutialamat.init({
    id_cuti: DataTypes.INTEGER,
    nik: DataTypes.BIGINT(16),
    alamat: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Cutialamat',
  });
  return Cutialamat;
};