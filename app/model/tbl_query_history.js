/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('tbl_query_history', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    open_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      defaultValue: '',
    },
    province: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    zj_gl: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    zj_sl: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    jm_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bg_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dw_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    zfzy_percent: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bt_country: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bt_country_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    bt_province: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bt_province_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    bt_city: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bt_city_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    dk_percent: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    dk_year: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    dk_rate: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    sunlight_hour: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    qesw_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    qesw_type: {
      type: DataTypes.CHAR(2),
      allowNull: true,
      defaultValue: '',
    },
    gz_level: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    bw_type: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
    },
    ext_info: {
      type: DataTypes.STRING(512),
      allowNull: true,
      defaultValue: '',
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
    tableName: 'tbl_query_history',
  });

  Model.associate = function() {

  };

  return Model;
};
