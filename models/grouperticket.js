'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Grouperticket extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Grouperticket.hasOne(models.Complaint, {
                foreignKey: 'noTiket',
                as: 'complain'
            })
            Grouperticket.belongsTo(models.Tiketgroup, {
                foreignKey: 'id_grup',
                as: 'grup_tiket'
            })
        }
    }
    Grouperticket.init({
        noTiket: DataTypes.STRING,
        id_grup: DataTypes.INTEGER,
        nama_dep: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Grouperticket',
    });
    return Grouperticket;
};