'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cutis', {
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
      type_cuti: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Jns_cutis'
          },
          key: 'id',
        }
      },
      mulai: {
        type: Sequelize.DATEONLY
      },
      samapi: {
        type: Sequelize.DATEONLY
      },
      jumlah: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Cutis');
  }
};