'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Jdldns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      typeDns: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Jnsdns'
          },
          key: 'slug',
        }
      },
      date: {
        type: Sequelize.DATEONLY
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
    await queryInterface.dropTable('Jdldns');
  }
};