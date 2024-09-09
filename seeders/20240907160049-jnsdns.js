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
        id: 1,
        type: "LIBUR",
        slug: "L",
        start_min: "00:00:00",
        start_max: "00:00:00",
        end_min: "00:00:00",
        end_max: "00:00:00",
        state: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        type: "FULL TIME",
        slug: "F5",
        start_min: "07:30:00",
        start_max: "08:00:00",
        end_min: "15:30:00",
        end_max: "16:00:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        type: "DINAS PAGI",
        slug: "P",
        start_min: "07:00:00",
        start_max: "07:30:00",
        end_min: "14:00:00",
        end_max: "14:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        type: "DINAS SIANG",
        slug: "S",
        start_min: "14:00:00",
        start_max: "14:30:00",
        end_min: "22:00:00",
        end_max: "22:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        type: "DINAS MALAM",
        slug: "M",
        start_min: "22:00:00",
        start_max: "22:30:00",
        end_min: "07:00:00",
        end_max: "07:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        type: "CUTI",
        slug: "C",
        start_min: "00:00:00",
        start_max: "00:00:00",
        end_min: "00:00:00",
        end_max: "00:00:00",
        state: 0,
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
    return queryInterface.bulkDelete("Jnsdns", null, {});
  },
};
