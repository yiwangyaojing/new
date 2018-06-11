/* indent size: 2 */
'use strict';

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('x_plantext_edit', {
        id: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        type_one: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        type_two: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        type_three: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        team_id: {
            type: DataTypes.INTEGER(10),
            allowNull: true
        },
        edit_openid: {
            type: DataTypes.STRING(63),
            allowNull: true
        },
        edit_name: {
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
        }
    }, {
        tableName: 'x_plantext_edit'
    });

    Model.associate = function() {

    }

    return Model;
};
