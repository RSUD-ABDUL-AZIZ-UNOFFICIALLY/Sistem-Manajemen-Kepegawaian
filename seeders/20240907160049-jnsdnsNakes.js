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
        type: "NAKES PAGI",
        slug: "NSK-P47",
        dep: 47,
        day: '["SEN", "SEL", "RAB", "KAM", "JUM"]',
        start_min: "06:30:00",
        start_max: "07:00:00",
        end_min: "14:30:00",
        end_max: "16:00:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "NAKES SOREH",
        slug: "NSK-S47",
        dep: 47,
        day: '["SEN", "SEL", "RAB", "KAM", "JUM"]',
        start_min: "14:00:00",
        start_max: "14:30:00",
        end_min: "20:30:00",
        end_max: "22:00:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "NAKES MALAM",
        slug: "NSK-M47",
        dep: 47,
        day: '["SEN", "SEL", "RAB", "KAM", "JUM","SAB"]',
        start_min: "20:00:00",
        start_max: "20:30:00",
        end_min: "07:00:00",
        end_max: "08:30:00",
        state: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        type: "CUTI",
        slug: "NSK-C47",
        dep: 47,
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
        slug: "NSK-L47",
        dep: 47,
        day: '["MIN"]',
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
