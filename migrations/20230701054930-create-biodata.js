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
        primaryKey: true,
        unique: true,
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
      tmt_pangkat: {
        type: Sequelize.DATEONLY
      },
      marital: {
        type: Sequelize.STRING
      },
      golongan_darah: {
        type: Sequelize.ENUM,
        values: ['A', 'B', 'AB', 'O']
      },
      tmt_kerja: {
        type: Sequelize.DATEONLY
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Biodatas');
  }
};