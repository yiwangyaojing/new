/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('tbl_result_matrix', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    query_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: '',
    },
    year_total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    zy_total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sw_total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sd_profit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    md_profit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bt_country: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bt_province: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bt_city: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bt_total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    profit_total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dk_total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    user_profit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    user_sum_profit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    seq: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    gmt_create: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    gmt_modified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ext_info: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: '',
    },
  }, {
    tableName: 'tbl_result_matrix',
  });

  Model.associate = function() {

  };

  return Model;
};
