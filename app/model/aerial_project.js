/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('aerial_project', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    open_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    project_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    linkman: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    remark: {
      type: DataTypes.STRING(1000),
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
    tableName: 'aerial_project',
  });

  Model.associate = function() {

  };

  return Model;
};
