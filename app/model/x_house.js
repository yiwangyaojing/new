/* indent size: 2 */
'use strict';

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('x_house', {
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
    customer_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    face_to: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(255),
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
    tableName: 'x_house'
  });

  Model.associate = function() {

  }

  return Model;
};
