'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ledger-cuti', {
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
      nik_atasan: {
        type: Sequelize.BIGINT(16),
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'nik',
        }
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
    await queryInterface.dropTable('ledger-cuti');
  }
};