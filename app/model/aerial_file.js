/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('aerial_file', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    aerial_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    gps_altitude: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    gps_latitude: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    gps_longitude: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    oss_file_path: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    oss_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    oss_bucket: {
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
  }, {
    tableName: 'aerial_file',
  });

  Model.associate = function() {

  };

  return Model;
};
