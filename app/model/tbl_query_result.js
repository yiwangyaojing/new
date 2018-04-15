/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('tbl_query_result', {
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
    xtrl: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    xtzj: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    nfdl: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sn_profit: {
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
    bt: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sn_pay: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sn_repay: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dkqj_profit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    y25_profit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    total_profit: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    y25_list: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: '{}',
    },
    ext_info: {
      type: DataTypes.STRING(512),
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
  }, {
    tableName: 'tbl_query_result',
  });

  Model.associate = function() {

  };

  return Model;
};
