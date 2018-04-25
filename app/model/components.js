/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('components', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    width: {
      type: 'DOUBLE(8,1)',
      allowNull: false,
      defaultValue: '1.0',
    },
    height: {
      type: 'DOUBLE(8,1)',
      allowNull: false,
      defaultValue: '1.0',
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
    tableName: 'components',
  });

  Model.associate = function() {

  };

  return Model;
};
