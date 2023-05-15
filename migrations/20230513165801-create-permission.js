'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nik: {
        type: Sequelize.BIGINT(16),
        primaryKey: true,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'nik',
        }
      },
      adminlpkp: {
        type: Sequelize.ENUM('true', 'false'),
        allowNull: true,
        defaultValue: 'false',
      },
      atasanlpkp: {
        type: Sequelize.ENUM('true', 'false'),
        allowNull: true,
        defaultValue: 'false',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('permissions');
  }
};
