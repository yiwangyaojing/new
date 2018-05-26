'use strict';
//模拟数据
let openId = 'abcd'; //模拟微信 id
let team_id = '999999999';
let OBJ = {
    openId:openId,          //模拟微信 id
    team_id:team_id,    //模拟公司 id
    //模拟用户信息
    userInfo:{
        openid:openId,         //微信 id
        nickName:'后台测试脚本用户',     //昵称
        name:' 后台测试脚本用户',        //微信昵称
        source_scene:'',               //来源场景
        inviter_openid:'',             //邀请人 openid
        inviter_name:'',               //邀请人姓名
        gender:'1',                    //性别
        province:'上海南站',            //省份
        city:'上海',                    //城市
        phone:'123123',                      //用户电话
        api_token:'',                   //token-未使用
        avatarUrl:'http://pics.sc.chinaz.com/files/pic/pic9/201805/zzpic11760.jpg',                   //用户头像地址
        login_infor:'',                 //小程序返回用户 JSON 字符集,用户的微信数据(json)
        created_at:'',              //创建时间
        updated_at:'',              //修改时间
        deleted_at:'',              //删除时间
        company_id:'',              //所属公司 Id
        company_founder:'后台测试脚本用户',         //公司创建人
        company_name:'后台测试脚本公司',            //公司名称
        company_logo:'http://pics.sc.chinaz.com/files/pic/pic9/201805/zzpic11760.jpg',            //公司 logo
        maxTeamId:team_id,               //所属最高团队 id
        maxTeamLevel:0,            //所属最高团队等级
        maxTeamRank:1,             //在最高团队中的角色
        managerTeams:'',            //可管理的所有团队
        showSampleClient:'1',        //示例用户是否可见
        brand:'',                   //手机品牌
        model:'',                   //手机型号
        version:'',                 //微信版本号
        system:'',                  //操作系统版本
        sdkversion:''             //客户端基础库版本
    },
    //模拟公司信息
    teamInfo:{
        id:team_id,
        open_id:openId,      //团队创建人 openId
        name:'后台测试脚本公司',    //团队名称
        logo:'http://pics.sc.chinaz.com/files/pic/pic9/201805/zzpic11760.jpg',  //团队 logo 地址
        oss_name:'',            //logo的oss文件名称，用于删除
        level:'0',          //团队级别 目前只有4级 0 代表公司
        register_phone:'',   //注册手机号
        parent_id:'',       //父级团队 id
        company_id:team_id,      //公司团队 id
        company_name:'后台测试脚本公司',    //公司昵称
        created_at:'',              //创建时间
        updated_at:'',              //修改时间
        deleted_at:''              //删除时间
    },
    //模拟用户签到信息
    signInfo:{
        open_id:openId,    //用户 id
        team_company_id:team_id,     //当前总团队的 id
        team_id:team_id,             //当前团队 id
        level:0,           //当前团队的等级
        user_rank:1,       //用户级别
        longitude:'1',       //当前经度
        latitude:'1',        //当前纬度
        site:'上海体育馆',            //签到的地点
        cst_name:'',        //关联的客户名字
        cst_id:'',          //关联的客户 id
        create_time:'2018-05-07 14:05:19',     //当前签到的时间
        remarks:'',         //备注
        min_site:'上海市',        //省略的地点
        name:'',            //昵称
        team_name:'后台测试脚本用户',       //当前公司的名字
        min_date:'2018-05-07',        //当前省略的时间
        url:'http://pics.sc.chinaz.com/files/pic/pic9/201805/zzpic11760.jpg',             //签到者的头像
    },
    //模拟客户信息(基础信息)
    xcustomerInfo:{
        id:1,
        name: 'controller李雷',
        user_id: Math.floor(new Date().getTime() / 1000),
        phone: '13300001111',
        province: '上海市',
        city: '上海市',
        street: '浦东新区惠南镇学海路28号',
    },
    //创建客户方案基本信息
    planyInfo:{
        id:1,
        open_id: openId,
        cst_name: 'controller李雷',
        cst_phone: '13122332323',
        cst_remark: '备注备注',
    },
//    创建方案状态(逾期)
    lanSchedule:{
        open_id:openId,
        plan_id:'1',    //对应 plan 表中的 id, 项目 id
        scd_status:0, //进度状态
        scd_name:'并网完成',    //进度名称
        from_status:'',         //进度来源状态
        from_name:'',           //来源名称
        scd_time:'2018-05-10',            //跟度时间
        scd_remark:'无',          //进度备注
        company_id:team_id,      //公司 id
        scd_r_remark:'5'
    },
//    创建方案回状态(汇款信息)
    planPay:{
        open_id:openId,
        plan_id:'1',
        zj_price:1,
        zj_price:50,
        pay_money:500,
        pay_time:'2018-5-10',
        // pay_id:'0',
        pay_period:1  //回款期次
    }
};
module.exports = OBJ;