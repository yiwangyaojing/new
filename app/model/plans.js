/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('plans', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    format: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    price: {
      type: 'DOUBLE(8,2)',
      allowNull: true,
    },
    capacity: {
      type: 'DOUBLE(8,2)',
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    plan_file_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'files',
        key: 'id',
      },
    },
    component_file_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'files',
        key: 'id',
      },
    },
    address: {
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
    tableName: 'plans',
  });

  Model.associate = function() {

  };

  return Model;
};
