/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('x_files', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    plan_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    open_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    oss_file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    source_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    source_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    data_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    sub_type: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mini_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    bucket: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    oss_file_key: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    size: {
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
    sort: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '0',
    },
  }, {
    tableName: 'x_files',
  });

  Model.associate = function() {

  };

  return Model;
};
