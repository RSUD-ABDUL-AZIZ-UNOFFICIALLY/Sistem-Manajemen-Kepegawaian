'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Maps_Absen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Maps_Absen.hasMany(models.Dump_Absen, {
        foreignKey: "id_finger",
        sourceKey: "id_finger",
        as: "dump_absen",
      });
    }
  }
  Maps_Absen.init({
    id_finger: DataTypes.INTEGER,
    nik: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Maps_Absen',
  });
  return Maps_Absen;
};