'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Tiketgroup extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Tiketgroup.init({
        nama_grup: DataTypes.STRING,
        wa_grup: DataTypes.STRING,
        wa_pj: DataTypes.STRING,
        nama_pj: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Tiketgroup',
    });
    return Tiketgroup;
};