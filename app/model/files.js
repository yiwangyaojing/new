/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('files', {
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
    md5: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    save_type: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: '',
    },
    mine_type: {
      type: DataTypes.STRING(60),
      allowNull: false,
      defaultValue: '',
    },
    plan_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
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
    BUCKET: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    OSS_FILE_KEY: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    SIZE: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    mine_path: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    function: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
  }, {
    tableName: 'files',
  });

  Model.associate = function() {

  };

  return Model;
};
