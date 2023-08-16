'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Biodatas', {
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
      alamat: {
        type: Sequelize.STRING
      },
      pangkat: {
        type: Sequelize.STRING
      },
      marital: {
        type: Sequelize.STRING
      },
      golongan_darah: {
        type: Sequelize.ENUM,
        values: ['A', 'B', 'AB', 'O']
      },
      jns_kerja: {
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
    },
      {
        indexes: [
          {
            unique: true,
            fields: ['nik']
          }
        ]
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Biodatas');
  }
};