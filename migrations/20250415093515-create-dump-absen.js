'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Dump_Absens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_finger: {
        type: Sequelize.INTEGER
      },
      tanggal: {
        type: Sequelize.DATEONLY
      },
      jam: {
        type: Sequelize.TIME
      },
      status: {
        type: Sequelize.STRING,
      },
      sn: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Mesin_Absens'
          },
          key: 'sn',
        }
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
    await queryInterface.addConstraint('Dump_Absens', {
      fields: ['id_finger', 'tanggal', 'jam'],
      type: 'unique',
      name: 'unique_dump_absen',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Dump_Absens');
  }
};