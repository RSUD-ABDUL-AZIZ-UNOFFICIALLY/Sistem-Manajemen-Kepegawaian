'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin_Absen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Admin_Absen.belongsTo(models.Departemen, {
        foreignKey: "dep",
        as: "departemen",
      });
    }
  }
  Admin_Absen.init({
    nik: DataTypes.INTEGER,
    dep: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Admin_Absen',
  });
  return Admin_Absen;
};