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
        type: "LIBUR",
        slug: "L1",
        dep: 1,
        day: '["MIN", "SAB"]',
        start_min: "00:00:00",
        start_max: "00:00:00",
        end_min: "00:00:00",
        end_max: "00:00:00",
        state: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "FULLDAY",
        slug: "F1",
        dep: 1,
        day: '["SEN", "SEL", "RAB", "KAM"]',
        start_min: "07:00:00",
        start_max: "07:30:00",
        end_min: "16:00:00",
        end_max: "17:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "FULLDAY",
        slug: "J1",
        dep: 1,
        day: '["JUM"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "16:00:00",
        end_max: "17:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "CUTI",
        slug: "C1",
        dep: 1,
        day: '[]',
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
