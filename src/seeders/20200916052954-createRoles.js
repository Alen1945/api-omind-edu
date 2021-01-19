"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "tRoles",
      [
        {
          name: "Admin",
          code: "ADM",
        },
        {
          name: "Employee",
          code: "EPY",
        },
        {
          name: "Customer",
          code: "CMR",
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tRoles", null, {});
  },
};
