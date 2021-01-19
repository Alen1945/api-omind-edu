'use strict'
module.exports = (sequelize, DataTypes) => {
  const tUsers = sequelize.define(
    'tUsers',
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      idtRole: DataTypes.INTEGER
    },
    {}
  )
  tUsers.associate = function (models) {
    // associations can be defined here
    tUsers.belongsTo(models.tRoles, {
      foreignKey: 'idtRole',
      targetKey: 'id'
    })
  }
  return tUsers
}
