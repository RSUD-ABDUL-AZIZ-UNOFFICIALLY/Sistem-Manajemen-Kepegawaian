'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tikets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      noTiket: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: "Complaints",
          },
          key: "noTiket",
        },
      },
      nama: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      keteranagn: {
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
    await queryInterface.dropTable('Tikets');
  }
};