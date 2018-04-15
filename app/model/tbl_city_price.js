/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('tbl_city_price', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    province: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: '',
    },
    city: {
      type: DataTypes.STRING(40),
      allowNull: false,
      defaultValue: '',
    },
    price_tlm: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    price_jm: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    gz_level: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      defaultValue: '',
    },
    price_bg: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bt_country: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bt_country_year: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    bt_province: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bt_province_year: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    sunlight_hour: {
      type: DataTypes.INTEGER(5),
      allowNull: false,
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
    tableName: 'tbl_city_price',
  });

  Model.associate = function() {

  };

  return Model;
};
