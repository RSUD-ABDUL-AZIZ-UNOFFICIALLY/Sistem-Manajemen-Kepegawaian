'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dump_Absen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Dump_Absen.belongsTo(models.Mesin_Absen, {
        foreignKey: "sn",
        targetKey: "sn",
        as: "mesin_absen",

      })
    }
  }
  Dump_Absen.init({
    id_finger: DataTypes.INTEGER,
    tanggal: DataTypes.DATEONLY,
    jam: DataTypes.TIME,
    status: DataTypes.STRING,
    // status: DataTypes.ENUM("0", "1"),
    sn: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Dump_Absen',
  });
  return Dump_Absen;
};