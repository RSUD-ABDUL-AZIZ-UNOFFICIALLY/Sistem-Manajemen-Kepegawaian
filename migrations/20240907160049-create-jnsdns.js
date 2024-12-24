'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jnsdns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true,
        allowNull: false
      },
      dep: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Departemens'
          },
          key: 'id'
        }
      },
      day: {
        type: Sequelize.STRING
      },
      start_min: {
        type: Sequelize.TIME
      },
      start_max: {
        type: Sequelize.TIME
      },
      end_min: {
        type: Sequelize.TIME
      },
      end_max: {
        type: Sequelize.TIME
      },
      state: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Jnsdns');
  }
};