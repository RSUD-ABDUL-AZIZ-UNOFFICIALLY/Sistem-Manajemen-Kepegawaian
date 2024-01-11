'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notifs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user: {
        type: Sequelize.BIGINT(16),
        unique: true,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'nik',
        }
      },
      status: {
        type: Sequelize.ENUM('AKTIF', 'PENSIUN')
      },
      whatsapp: {
        type: Sequelize.ENUM('0','1')
      },
      email: {
        type: Sequelize.ENUM('0','1')
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
    await queryInterface.dropTable('Notifs');
  }
};