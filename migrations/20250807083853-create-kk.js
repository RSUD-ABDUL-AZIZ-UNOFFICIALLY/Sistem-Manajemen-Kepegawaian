'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Kks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kk_number: {
        type: Sequelize.STRING
      },
      kk_head_name: {
        type: Sequelize.STRING
      },
      kk_address: {
        type: Sequelize.STRING
      },
      family_members: {
        type: Sequelize.INTEGER
      },
      kk_issue_date: {
        type: Sequelize.DATEONLY
      },
      catatan: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      fileUrl: {
        type: Sequelize.STRING
      },
      nik: {
        type: Sequelize.BIGINT,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'nik'
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
    await queryInterface.dropTable('Kks');
  }
};