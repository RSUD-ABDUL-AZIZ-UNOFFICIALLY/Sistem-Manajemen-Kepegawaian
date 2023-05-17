'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Atasans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user: {
        type: Sequelize.BIGINT(16),
        primaryKey: true,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'nik',
        }
      },
      bos: {
        type: Sequelize.BIGINT(16),
        primaryKey: true,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'nik',
        }
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
    await queryInterface.dropTable('Atasans');
  }
};