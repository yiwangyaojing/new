/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('x_plans', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    open_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cst_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cst_phone: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    cst_position: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cst_address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cst_latitude: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    cst_longitude: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    cst_province: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cst_city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cst_street: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cst_remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zj_format: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    zj_capacity: {
      type: "DOUBLE(8,2)",
      allowNull: true
    },
    zj_num: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    zj_unit_price: {
      type: "DOUBLE(8,2)",
      allowNull: true
    },
    zj_price: {
      type: "DOUBLE(10,2)",
      allowNull: true
    },
    zj_source: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    rf_is_finish: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    rf_params: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    rf_image: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    rf_remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    h_is_finish: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    h_face: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    h_remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    d_is_finish: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    d_remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    short_url: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    team_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    company_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    scd_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    scd_status: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    scd_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    scd_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    pay_time: {
      type: DataTypes.TIME,
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
    pay_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    overdue_date: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    created_at: {
      type: DataTypes.TIME,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.TIME,
      allowNull: true
    },
    deleted_at: {
      type: DataTypes.TIME,
      allowNull: true
    }
  }, {
    tableName: 'x_plans'
  });

  Model.associate = function() {

  }

  return Model;
};
