/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('x_team', {
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    oss_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    level: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    register_phone: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    company_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
      plan_survey: {
      type: DataTypes.STRING(11),
        allowNull: true
    },
      plan_data: {
          type: DataTypes.STRING(11),
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
    tableName: 'x_team'
  });

  Model.associate = function() {

  }

  return Model;
};
