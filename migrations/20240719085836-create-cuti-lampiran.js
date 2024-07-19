'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cuti_lampirans', {
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
      id_cuti: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Cutis'
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      file: {
        type: Sequelize.STRING
      },
      periode: {
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
    await queryInterface.dropTable('Cuti_lampirans');
  }
};