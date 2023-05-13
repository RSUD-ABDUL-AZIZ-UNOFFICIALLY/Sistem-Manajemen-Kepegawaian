'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rekaps', {
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
      capaian: {
        type: Sequelize.INTEGER
      },
      kategori: {
        type: Sequelize.ENUM,
        values: ['BAIK', 'CUKUP', 'KURANG','WKE MINIMAL TIDAK TERPENUHI']
      },
      tpp: {
        type: Sequelize.INTEGER
      },
      ket: {
        type: Sequelize.STRING
      },
      periode: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Rekaps');
  }
};