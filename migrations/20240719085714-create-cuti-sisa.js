'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cuti_sisas', {
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
      periode: {
        type: Sequelize.INTEGER
      },
      sisa: {
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
    await queryInterface.addConstraint('Cuti_sisas', {
      fields: ['nik', 'periode'],
      type: 'unique',
      name: 'unique_nik_periode',
    });
    await queryInterface.addIndex('Cuti_sisas', ['nik'], {
      name: 'idx_nik',
      unique: false
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cuti_sisas');
  }
};