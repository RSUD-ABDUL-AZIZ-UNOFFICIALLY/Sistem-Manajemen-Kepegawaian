'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ijazah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ijazah.init({
    education_level: DataTypes.STRING,
    major: DataTypes.STRING,
    institution: DataTypes.STRING,
    graduation_date: DataTypes.DATEONLY,
    ijazah_number: DataTypes.STRING,
    gpa: DataTypes.FLOAT,
    catatan: DataTypes.STRING,
    status: DataTypes.STRING,
    fileUrl: DataTypes.STRING,
    nik: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Ijazah',
  });
  return Ijazah;
};