'use strict';

const Controller = require('egg').Controller;


class RoofController extends Controller {


    // 计算排板子坐标集合
    async index(){

        const req = {
            background:{
                width:0,
                height:0,
                minWidth:0,
                type:0
            }
        }

        const ctx  = this.ctx

        let bg = {} // 背景图

    }

}

module.export  = RoofController