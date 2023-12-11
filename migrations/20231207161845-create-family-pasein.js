'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FamilyPaseins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      familyId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Pasiens'
          },
          key: 'id',
        },
      },
      nik: {
        type: Sequelize.BIGINT
      },
      nama: {
        type: Sequelize.STRING
      },
      hubungan: {
        type: Sequelize.STRING
      },
      noRm: {
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
    await queryInterface.addConstraint('FamilyPaseins', {
      type: 'unique',
      fields: ['familyId', 'noRm'],
      name: 'unique_noRm_familyId'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FamilyPaseins');
  }
};