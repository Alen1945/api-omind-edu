"use strict";
module.exports = (sequelize, DataTypes) => {
  const tRoles = sequelize.define(
    "tRoles",
    {
      name: DataTypes.STRING,
      code: DataTypes.STRING,
    },
    {}
  );
  tRoles.associate = function (models) {
    // associations can be defined here
    tRoles.hasMany(models.tUsers, { foreignKey: "idtRole" });
  };
  return tRoles;
};
