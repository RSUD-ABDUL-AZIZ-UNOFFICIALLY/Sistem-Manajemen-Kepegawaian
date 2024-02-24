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
    return queryInterface.bulkInsert("Tiketgroups", [
      {
        id: 1,
        nama_grup: "IT Support",
        wa_grup: "IT-support",
        wa_pj: "089677889263",
        nama_pj: "Amirudin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        nama_grup: "IT Support",
        wa_grup: "IT-support",
        wa_pj: "089609889808",
        nama_pj: "Imam Akbar",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        nama_grup: "Sarana Prasarana",
        wa_grup: "Gudang Barang",
        wa_pj: "Fera Selawati",
        nama_pj: "Fera Selawati",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        nama_grup: "Prasarana Bagunan (AC)",
        wa_grup: "Sarana-Prasarana",
        wa_pj: "089518361176",
        nama_pj: "INDRA SAPUTRA",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        nama_grup: "IT SIMRS",
        wa_grup: "IT-support",
        wa_pj: "089693913836",
        nama_pj: "Ahmat Junaidi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Tiketgroups", null, {});
  },
};
