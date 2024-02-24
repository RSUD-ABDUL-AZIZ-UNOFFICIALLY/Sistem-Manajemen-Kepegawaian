'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Groupertickets', {
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
      id_grup: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Tiketgroups",
          },
          key: "id",
        },
      },
      nama_dep: {
        type: Sequelize.STRING
      },
      pj: {
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
    await queryInterface.dropTable('Groupertickets');
  }
};