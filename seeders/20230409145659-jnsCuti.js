"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("Jns_cutis", [
      {
        id: 1,
        type_cuti: "Cuti Tahuan",
        max: 12,
        total: 12,
        status: "PNS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        type_cuti: "Cuti Tahuan",
        max: 6,
        total: 12,
        status: "PPPK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        type_cuti: "Cuti Tahuan",
        max: 5,
        total: 12,
        status: "Non ASN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        type_cuti: "Cuti Alasan Penting",
        max: 10,
        total: 30,
        status: "PNS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        type_cuti: "Cuti Alasan Penting",
        max: 10,
        total: 30,
        status: "PPPK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        type_cuti: "Cuti Alasan Penting",
        max: 10,
        total: 30,
        status: "Non ASN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        type_cuti: "Cuti Sakit",
        max: 30,
        total: 30,
        status: "PNS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        type_cuti: "Cuti Sakit",
        max: 30,
        total: 30,
        status: "PPPK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 9,
        type_cuti: "Cuti Sakit",
        max: 30,
        total: 30,
        status: "Non ASN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 10,
        type_cuti: "Cuti Melahirkan",
        max: 90,
        total: 90,
        status: "PNS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 11,
        type_cuti: "Cuti Melahirkan",
        max: 90,
        total: 90,
        status: "PPPK",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 12,
        type_cuti: "Cuti Melahirkan",
        max: 90,
        total: 90,
        status: "Non ASN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 13,
        type_cuti: "Cuti Besar",
        max: 90,
        total: 90,
        status: "PNS",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Jns_cutis", null, {});
  },
};
