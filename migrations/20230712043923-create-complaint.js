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
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
      },
      nik: {
        type: Sequelize.BIGINT(16),
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'nik',
        }
      },
      nama: {
        type: Sequelize.STRING
      },
      noHp: {
        type: Sequelize.STRING
      },
      dep: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Departemens",
          },
          key: "id",
        },
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