'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Strs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      str_number: {
        type: Sequelize.STRING
      },
      profession: {
        type: Sequelize.STRING
      },
      issue_date: {
        type: Sequelize.DATEONLY
      },
      expiry_date: {
        type: Sequelize.DATEONLY
      },
      issuer: {
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
    await queryInterface.dropTable('Strs');
  }
};