/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('x_roof', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    plan_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    customer_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    roof_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    templet: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    params: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '{}'
    },
    deleted_at: {
      type: DataTypes.TIME,
      allowNull: true
    },
    created_at: {
      type: DataTypes.TIME,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'x_roof'
  });

  Model.associate = function() {

  }

  return Model;
};
