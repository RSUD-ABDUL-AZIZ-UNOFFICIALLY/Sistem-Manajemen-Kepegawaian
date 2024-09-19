'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cuti_approvals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_cuti: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Cutis'
          },
          key: 'id',
        }
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
      departement: {
        type: Sequelize.STRING,
      },
      jabatan: {
        type: Sequelize.STRING,
      },
      pangkat: {
        type: Sequelize.STRING,
      },
      approve_date: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Disetujui', 'Ditolak', 'Menunggu', 'Perubahan', 'Ditangguhkan', 'Tidak Disetujui']
      },
      keterangan: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Cuti_approvals');
  }
};