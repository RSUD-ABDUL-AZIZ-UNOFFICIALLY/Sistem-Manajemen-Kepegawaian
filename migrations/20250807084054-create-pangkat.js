'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pangkats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Pendidikan: {
        type: Sequelize.STRING
      },
      gol_ruang: {
        type: Sequelize.STRING
      },
      gol_ruang_tmt: {
        type: Sequelize.DATEONLY
      },
      jabatan: {
        type: Sequelize.STRING
      },
      jabatan_tmt: {
        type: Sequelize.DATEONLY
      },
      document_date: {
        type: Sequelize.DATEONLY
      },
      document_issuer: {
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
    await queryInterface.dropTable('Pangkats');
  }
};