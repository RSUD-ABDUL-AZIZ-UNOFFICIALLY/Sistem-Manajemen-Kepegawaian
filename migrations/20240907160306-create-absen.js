'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Absens', {
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
      typeDns: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Jnsdns'
          },
          key: 'slug',
        }
      },
      date: {
        type: Sequelize.DATEONLY
      },
      cekIn: {
        type: Sequelize.TIME
      },
      statusIn: {
        type: Sequelize.ENUM('Masuk Cepat', 'Masuk Terlambat', 'Masuk Tepat Waktu')
      },
      keteranganIn: {
        type: Sequelize.STRING
      },
      nilaiIn: {
        type: Sequelize.INTEGER
      },
      geoIn: {
        type: Sequelize.STRING
      },
      loactionIn: {
        type: Sequelize.STRING
      },
      visitIdIn: {
        type: Sequelize.STRING
      },
      cekOut: {
        type: Sequelize.TIME
      },
      statusOut: {
        type: Sequelize.ENUM('Pulang Cepat', 'Pulang Terlambat', 'Pulang Tepat Waktu')
      },
      keteranganOut: {
        type: Sequelize.STRING
      },
      nilaiOut: {
        type: Sequelize.INTEGER
      },
      geoOut: {
        type: Sequelize.STRING
      },
      visitIdOut: {
        type: Sequelize.STRING
      },
      loactionOut: {
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
    await queryInterface.dropTable('Absens');
  }
};