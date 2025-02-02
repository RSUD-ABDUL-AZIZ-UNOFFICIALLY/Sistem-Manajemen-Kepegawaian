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
    return queryInterface.bulkInsert("Jnsdns", [
      {
        type: "FULLDAY SENIN-KAMIS",
        slug: "FSK7",
        dep: 7,
        day: '["SEN", "SEL", "RAB", "KAM"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "15:00:00",
        end_max: "16:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "FULLDAY JUMAT",
        slug: "FJ7",
        dep: 7,
        day: '["JUM"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "11:00:00",
        end_max: "13:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "FULLDAY SABTU",
        slug: "FS7",
        dep: 7,
        day: '["SAB"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "13:30:00",
        end_max: "15:00:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "CUTI",
        slug: "C7",
        dep: 7,
        day: '[]',
        start_min: "00:00:00",
        start_max: "00:00:00",
        end_min: "00:00:00",
        end_max: "00:00:00",
        state: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "LIBUR",
        slug: "L8",
        dep: 8,
        day: '["MIN"]',
        start_min: "00:00:00",
        start_max: "00:00:00",
        end_min: "00:00:00",
        end_max: "00:00:00",
        state: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "DOKTER SPESIALIS FULLDAY SENIN-KAMIS",
        slug: "DS-FSK8",
        dep: 8,
        day: '["SEN", "SEL", "RAB", "KAM"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "15:00:00",
        end_max: "16:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "DOKTER SPESIALIS FULLDAY JUMAT",
        slug: "DS-FJ8",
        dep: 8,
        day: '["JUM"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "11:00:00",
        end_max: "13:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "DOKTER SPESIALIS FULLDAY SABTU",
        slug: "DS-FS8",
        dep: 8,
        day: '["SAB"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "13:30:00",
        end_max: "15:00:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "CUTI",
        slug: "C8",
        dep: 8,
        day: '[]',
        start_min: "00:00:00",
        start_max: "00:00:00",
        end_min: "00:00:00",
        end_max: "00:00:00",
        state: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "LIBUR",
        slug: "L12",
        dep: 12,
        day: '["MIN"]',
        start_min: "00:00:00",
        start_max: "00:00:00",
        end_min: "00:00:00",
        end_max: "00:00:00",
        state: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "FULLDAY SENIN-KAMIS",
        slug: "FSK12",
        dep: 12,
        day: '["SEN", "SEL", "RAB", "KAM"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "15:00:00",
        end_max: "16:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "FULLDAY JUMAT",
        slug: "FJ12",
        dep: 12,
        day: '["JUM"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "11:00:00",
        end_max: "13:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "FULLDAY SABTU",
        slug: "FS12",
        dep: 12,
        day: '["SAB"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "13:30:00",
        end_max: "15:00:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "CUTI",
        slug: "C12",
        dep: 12,
        day: '[]',
        start_min: "00:00:00",
        start_max: "00:00:00",
        end_min: "00:00:00",
        end_max: "00:00:00",
        state: 0,
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
    return queryInterface.bulkDelete("Jnsdns", null, {});
  },
};
