'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Trackers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nik: {
        type: Sequelize.BIGINT
      },
      userAgent: {
        type: Sequelize.STRING
      },
      vendor: {
        type: Sequelize.STRING
      },
      os: {
        type: Sequelize.STRING
      },
      ip: {
        type: Sequelize.STRING
      },
      as: {
        type: Sequelize.STRING
      },
      isp: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      batteryLevel: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Trackers');
  }
};