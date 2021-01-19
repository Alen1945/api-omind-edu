"use strict";
module.exports = (sequelize, DataTypes) => {
  const tMateris = sequelize.define(
    "tMateris",
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      image: DataTypes.TEXT,
    },
    {}
  );
  tMateris.associate = function (models) {
    // associations can be defined here
  };
  return tMateris;
};
