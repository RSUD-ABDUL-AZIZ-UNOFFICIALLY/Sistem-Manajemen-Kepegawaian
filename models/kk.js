'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kk.init({
    kk_number: DataTypes.STRING,
    kk_head_name: DataTypes.STRING,
    kk_address: DataTypes.STRING,
    family_members: DataTypes.INTEGER,
    kk_issue_date: DataTypes.DATEONLY,
    catatan: DataTypes.STRING,
    status: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    nik: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Kk',
  });
  return Kk;
};