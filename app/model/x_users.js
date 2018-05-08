/* indent size: 2 */
'use strict';

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('x_users', {
        id: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        openid: {
            type: DataTypes.STRING(63),
            allowNull: false
        },
        nickName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        inviter_openid: {
            type: DataTypes.STRING(63),
            allowNull: true
        },
        inviter_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        gender: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        province: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        city: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        api_token: {
            type: DataTypes.STRING(63),
            allowNull: true
        },
        avatarUrl: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        login_infor: {
            type: DataTypes.STRING(500),
            allowNull: true,
            defaultValue: '{}'
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
        },
        company_id: {
            type: DataTypes.INTEGER(10),
            allowNull: true
        },
        company_founder: {
            type: DataTypes.STRING(63),
            allowNull: true
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        company_logo: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        maxTeamId: {
            type: DataTypes.INTEGER(10),
            allowNull: true
        },
        maxTeamLevel: {
            type: DataTypes.INTEGER(5),
            allowNull: true
        },
        maxTeamRank: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        managerTeams: {
            type: DataTypes.STRING(500),
            allowNull: true,
            defaultValue: '[]'
        },
        showSampleClient: {
            type: DataTypes.INTEGER(1),
            allowNull: false,
            defaultValue: 1
        }
    }, {
        tableName: 'x_users'
    });

    Model.associate = function () {

    }

    return Model;
};
