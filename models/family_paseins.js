'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Family_paseins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Family_paseins.init({
    familyId: DataTypes.INTEGER,
    nik: DataTypes.BIGINT,
    nama: DataTypes.STRING,
    hubungan: DataTypes.STRING,
    noRm: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Family_paseins',
  });
  return Family_paseins;
};