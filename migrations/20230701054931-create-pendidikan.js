'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pendidikans', {
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
      tingkat: {
        type: Sequelize.STRING
      },
      jurusan: {
        type: Sequelize.STRING
      },
      sekolah: {
        type: Sequelize.STRING
      },
      tempat: {
        type: Sequelize.STRING
      },
      nomor_ijazah: {
        type: Sequelize.STRING
      },
      tahun_lulus: {
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
    await queryInterface.dropTable('Pendidikans');
  }
};