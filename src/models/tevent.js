"use strict";
module.exports = (sequelize, DataTypes) => {
  const tEvents = sequelize.define(
    "tEvents",
    {
      title: DataTypes.STRING,
      eventDate: DataTypes.DATEONLY,
      description: DataTypes.TEXT,
      image: DataTypes.TEXT,
    },
    {}
  );
  tEvents.associate = function (models) {
    // associations can be defined here
  };
  return tEvents;
};
