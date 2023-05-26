"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nik: {
        allowNull: false,
        unique: true,
        primaryKey: true,
        type: Sequelize.BIGINT(16),
      },
      JnsKel: {
        type: Sequelize.ENUM,
        values: ['Laki-laki', 'Perempuan']
      },
      nip: {
        type: Sequelize.STRING(300),
      },
      tgl_lahir: {
        type: Sequelize.DATEONLY,
      },
      nama: {
        type: Sequelize.STRING,
      },
      dep: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Departemens",
          },
          key: "id",
        },
      },
      jab: {
        type: Sequelize.STRING(300),
      },
      wa: {
        allowNull: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['PNS', 'PPPK', 'Non ASN']
      },
      email: {
        type: Sequelize.STRING(300),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
 
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
