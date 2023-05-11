'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Departemen, {
        foreignKey: 'dep',
        as: 'departemen'
      })
    }
  }
  User.init({
    nik: DataTypes.INTEGER,
    nip: DataTypes.INTEGER,
    jnsKel: DataTypes.ENUM('Laki-laki', 'Perempuan'),
    tgl_lahir: DataTypes.DATE,
    nama: DataTypes.STRING,
    dep: DataTypes.INTEGER,
    jab: DataTypes.STRING(300),
    wa: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};