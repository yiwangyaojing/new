/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('migrations', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    migration: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    batch: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
  }, {
    tableName: 'migrations',
  });

  Model.associate = function() {

  };

  return Model;
};
