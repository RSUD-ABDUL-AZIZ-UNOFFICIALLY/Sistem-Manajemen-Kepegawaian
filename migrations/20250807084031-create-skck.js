'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Skcks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      skck_number: {
        type: Sequelize.STRING
      },
      skck_issuer: {
        type: Sequelize.STRING
      },
      skck_issue_date: {
        type: Sequelize.DATEONLY
      },
      skck_purpose: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Skcks');
  }
};