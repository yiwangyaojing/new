/* indent size: 2 */
'use strict';

module.exports = app => {
    const DataTypes = app.Sequelize;

    const Model = app.model.define('x_sign', {
        id: {
            type: DataTypes.INTEGER(10),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        // 用户 id
        open_id: {
            type: DataTypes.STRING(63),
            allowNull: true
        },
        // 当前总团队 id
        team_company_id: {
            type: DataTypes.INTEGER(10),
            allowNull: true
        },
        // 当前团队的 id
        team_id: {
            type: DataTypes.INTEGER(10),
            allowNull: true
        },
        // 当前团队的等级
        level: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        // 用户级别管理,1管理员,2业务员
        user_rank: {
            type: DataTypes.INTEGER(1),
            allowNull: true
        },
        // 当前经度
        longitude:{
            type: DataTypes.STRING(25),
            allowNull: true
        },
        // 当前纬度
        latitude:{
            type: DataTypes.STRING(25),
            allowNull: true
        },
        // 当前签到地点
        site:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // 当前关联客户的姓名
        cst_name:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // 关联的客户 id
        cst_id:{
            type: DataTypes.INTEGER(10),
            allowNull: true
        },
        // 时间
        create_time:{
            type: DataTypes.TIME,
            allowNull: true
        },
        // 备注
        remarks:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // 必要创建时间
        created_at:{
            type: DataTypes.TIME,
            allowNull: true
        },
        // 必要修改时间
        updated_at:{
            type: DataTypes.TIME,
            allowNull: true
        },
        // 省略的地点
        min_site:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // 签到者的名字
         name:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // 当前公司的名字
        team_name:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // 当前省略的时间
        min_date:{
            type: DataTypes.STRING(255),
            allowNull: true
        },
        // 签到者的头像
        url:{
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
            tableName: 'x_sign'
        });

    Model.associate = function () {

    }

    return Model;
};
