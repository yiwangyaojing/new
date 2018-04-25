/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('roofs', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: DataTypes.STRING(31),
      allowNull: false,
    },
    default_params: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '{}',
    },
    plan_file_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      references: {
        model: 'files',
        key: 'id',
      },
    },
    cover_file_id: {
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
    obstacle_position: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    created_at: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  }, {
    tableName: 'roofs',
  });

  Model.associate = function() {

  };

  return Model;
};
