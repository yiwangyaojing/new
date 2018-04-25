/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('admins', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(63),
      allowNull: true,
    },
    salt: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    api_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  }, {
    tableName: 'admins',
  });

  Model.associate = function() {

  };

  return Model;
};
