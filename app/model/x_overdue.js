/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('x_overdue', {
    id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    htqd: {
      type: DataTypes.INTEGER(5),
      allowNull: true,
    },
    sgwc: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    bwwc: {
      type: DataTypes.INTEGER(5),
      allowNull: true
    },
    company_id: {
      type: DataTypes.INTEGER(10),
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
    tableName: 'x_overdue'
  });

  Model.associate = function() {

  }

  return Model;
};
