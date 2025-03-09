'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Session.init({
    nik: DataTypes.BIGINT,
    session_token: DataTypes.TEXT,
    ip_address: DataTypes.STRING,
    user_agent: DataTypes.TEXT,
    visited_id: DataTypes.STRING,
    status: DataTypes.ENUM('login', 'logout', 'expire', 'close', 'online')
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};