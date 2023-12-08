'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FamilyPasein extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  FamilyPasein.init({
    familyId: DataTypes.INTEGER,
    nik: DataTypes.BIGINT,
    nama: DataTypes.STRING,
    noRm: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FamilyPasein',
  });
  return FamilyPasein;
};