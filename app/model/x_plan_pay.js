/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('x_plan_pay', {
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
    open_id: {
      type: DataTypes.STRING(63),
      allowNull: true
    },
    pay_period: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    pay_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    zj_price: {
      type: "DOUBLE(10,2)",
      allowNull: true
    },
    pay_money: {
      type: "DOUBLE(10,2)",
      allowNull: true
    },
    pay_sum: {
      type: "DOUBLE(10,2)",
      allowNull: true
    },
    pay_gap: {
      type: "DOUBLE(10,2)",
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
    tableName: 'x_plan_pay'
  });

  Model.associate = function() {

  }

  return Model;
};
