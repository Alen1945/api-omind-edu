"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "tUsers",
      [
        {
          idtRole: 1,
          username: "myadmin",
          password: bcrypt.hashSync("myadmin123"),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tUsers", null, {});
  },
};
