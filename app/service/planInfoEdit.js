'use strict';

const Service = require('egg').Service;

class FileService extends Service {

    async index (info) {
        console.log('输出当前修改的文字',info)

        if(!info.team_id || !info.edit_openid || !info.edit_name) {
            return false
        }
        let team_id = info.team_id
        let team = await this.ctx.model.XTeam.findOne({where: {id: team_id}});
        if (!team || !team.dataValues){
            return false
        }
        console.log(team.dataValues)
        if (!team.dataValues.plan_data){
            console.log('新建项目资料编辑表')
            //该字段为项目勘测文字的 id
            let suc = await this.ctx.model.XPlaninfoEdit.create(info)
            if (suc && suc.dataValues && suc.dataValues.id){
                let id = suc.dataValues.id
                await this.ctx.model.XTeam.update({'plan_data': id}, {where: {id: team_id}})
                return true
            }else{
                return false
            }
            //新增项目勘测数据
        } else {
            //从项目勘测字段查项目勘测数据,并且修改
            let id = team.dataValues.plan_data;
            await this.ctx.model.XPlaninfoEdit.update({'type_one': info.type_one,'type_two':info.type_two,'type_three':info.type_three}, {where: {id: id}})
            console.log('修改项目资料编辑表')

        }
        return info
    }

    async getPlanText (info) {
        let team_id = info.companyId
        let team = await this.ctx.model.XTeam.findOne({where: {id: team_id}});
        if (!team || !team.dataValues) {
            return []
        }
        let planText = await this.ctx.model.XPlaninfoEdit.findOne({where: {id: team.dataValues.plan_data}});
        let arr = []
        if (!planText || !planText.dataValues || !planText.dataValues.type_one) {
            return []
        }else{
            arr = [planText.dataValues.type_one,planText.dataValues.type_two,planText.dataValues.type_three];
        }
        return arr
    }
}

module.exports = FileService;
