'use strict';

const Service = require('egg').Service;



class TeamService extends Service {

    async findAll(company_id){

        return  await this.ctx.model.XTeam.findAll({where:{id:company_id},order:[['level','asc']]})

    }


    async findByIds(teamIds){
        return await this.ctx.model.XTeam.findAll({where:{id:teamIds},order:[['level','asc']]})
    }


}

module.exports = TeamService;
