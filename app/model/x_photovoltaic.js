/* indent size: 2 */
'use strict';
module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('x_photovoltaic', {
        id: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        partsInfo: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        noCompleteInfo: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        contactsName: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        contactsText: {
            type: DataTypes.STRING(5000),
            allowNull: true
        },
        contactsPlone: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        teamName: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        site: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        min_province: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        min_city: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        uuid: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        loanChoose: {
            type: DataTypes.STRING(20),
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
    }, {
        tableName: 'x_photovoltaic'
    });

    Model.associate = function() {

    }

    return Model;
};
