'use strict';

module.exports = {

    // oss上传文件夹根目录
    OssContext: 'mp_xiaosolar-sales',

    // 首页轮播广告
    IndexSliderAd: 0,
    // 首页开屏广告
    IndexAd: 1,
    // 拍房子 -  拍房子图片类型 房屋图片、电表箱图片、其他
    HouseImg: 2, HouseImg_h: 0, HouseImg_db: 1, HouseImg_other: 2,
    // 收资料 -- 收资料图片类型 身份证、产权证明、电费单、银行卡、并网申请、合同
    DataImg: 3, DataImg_cd: 0, DataImg_cq: 1, DataImg_df: 2, DataImg_yh: 3, DataImg_bw: 4, DataImg_ht: 5,

    // 特殊房屋
    specialHouseImg: 4,

    // 排板子图片保存
    roofImg: 5,

    // 公司logo
    companyLogo: 6,

    // 计算器 递减变量
    reduction: 0.7,

    // 团队级别
    TeamLevel: {
        company: 0, //公司团队
        one: 1,  // 子团队
        tow: 2,  // 2级子团队
        three: 3, // 3级子团队
    },

    //用户等级
    UserRank: {
        admin: 1, // 管理员
        agent: 2,  // 业务员
        other: 3,  // 其他职位
    },

    // 方案进度
    schedule: {
        xzxm: 0, //  客户新增
        yxgt: 1,//  意向沟通
        htqd: 2, //  合同签订
        sgwc: 3,//  施工完成
        bwwc: 4,//  并网完成
        ywzz: 5,  // 意外终止
        hkwc: 6 //   回款完成

    },
    scheduleName: ['新增项目', '意向沟通', '合同签订', '施工完成', '并网完成', '意外终止'],
    // 项目查询时间
    ProjectDate: {
        '昨日': '昨日',
        '今日': '今日',
        '上周': '上周',
        '本周': '本周',
        '上月': '上月',
        '本月': '本月',
        '本年': '本年',
        '累计': '累计'
    },
    // 示例客户的数据库id，需要手动先新建一个数据完整的用户，然后更改此处的值
    sampleClientId: 284,
};
