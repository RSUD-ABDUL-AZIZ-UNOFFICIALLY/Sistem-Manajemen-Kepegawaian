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
    return queryInterface.bulkInsert("Departemens", [
      {
        bidang: "Direktur",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Wakil Direktur",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Bagian Umum dan Kepegawaian",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Bagian Perencanaan dan Keuangan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Bidang Pelayanan Medik dan Penujang Medik",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Bidang Pelayanan Penunjang Non Medik",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Bagian Keperawatan dan Kebidanan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Dokter Spesialis",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Dokter Umum",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Dokter Gigi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "IGD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Poliklinik",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Bedah",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Instalasi Bedah Sentral",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang ICU/ICCU",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Bersalin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: " Ruang Nifas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Perinatologi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Anak",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Penyakit Dalam",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Saraf",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang VIP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Kelas 1B",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Kelas 1C",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Isolasi Covid",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Ruang Hemodialisa",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Supervisi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "PPIRS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "MPP",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Rekam Medik",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Instalasi LAB Patologi Klinik",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Instalasi LAB Mikrobiologi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "UTDRS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "PKRS",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "CSSD",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Radiologi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Farmasi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Rehabilitasi Medik",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Sanitasi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Teknisi Elektromedis",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Gizi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Loundry",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "PRT Ruangan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Satpam",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bidang: "Gudang Barang",
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
    return queryInterface.bulkDelete("Departemens", null, {});
  },
};
