/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('x_team_user', {
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
    user_rank: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    team_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    team_level: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    team_parent_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    team_company_id: {
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
    tableName: 'x_team_user'
  });

  Model.associate = function() {

  }

  return Model;
};
