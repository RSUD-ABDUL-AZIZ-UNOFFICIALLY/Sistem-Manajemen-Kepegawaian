'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Complaints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      noTiket: {
        type: Sequelize.STRING
      },
      nama: {
        type: Sequelize.STRING
      },
      noHp: {
        type: Sequelize.STRING
      },
      dep: {
        type: Sequelize.STRING
      },
      topic: {
        type: Sequelize.STRING
      },
      kendala: {
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
    await queryInterface.dropTable('Complaints');
  }
};