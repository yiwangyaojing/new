/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('x_plan_schedule', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    open_id: {
      type: DataTypes.STRING(63),
      allowNull: true
    },
    plan_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    scd_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    scd_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    from_status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    from_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    scd_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    scd_remark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    scd_r_remark: {
      type: DataTypes.STRING(500),
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
    tableName: 'x_plan_schedule'
  });

  Model.associate = function() {

  }

  return Model;
};
