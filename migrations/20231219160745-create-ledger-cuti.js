'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ledger_cutis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nik_user: {
        type: Sequelize.BIGINT(16),
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'nik',
        }
      },
      name_user: {
        type: Sequelize.STRING
      },
      jabatan: {
        type: Sequelize.STRING
      },
      pangkat: {
        type: Sequelize.STRING
      },
      departemen: {
        type: Sequelize.STRING
      },
      nik_atasan: {
        type: Sequelize.BIGINT(16),
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'nik',
        }
      },
      name_atasan: {
        type: Sequelize.STRING
      },
      tembusan: {
        type: Sequelize.STRING
      },
      periode: {
        type: Sequelize.INTEGER
      },
      type_cuti: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Jns_cutis'
          },
          key: 'id',
        }
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
      sisa_cuti: {
        type: Sequelize.INTEGER
      },
      cuti_diambil: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Ledger_cutis');
  }
};