/* indent size: 2 */
'use strict';
module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('feedback_file', {
    feedback_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
    file_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'feedback_file',
  });

  Model.associate = function() {

  };

  return Model;
};
