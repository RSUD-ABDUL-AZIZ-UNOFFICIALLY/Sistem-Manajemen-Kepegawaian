'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nik: {
        type: Sequelize.BIGINT
      },
      session_token: {
        type: Sequelize.TEXT
      },
      ip_address: {
        type: Sequelize.STRING
      },
      user_agent: {
        type: Sequelize.TEXT
      },
      visited_id: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('login', 'logout', 'expire', 'close','online')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};