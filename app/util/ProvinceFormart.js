'use strict';

// 微信获取用户的省市与高德地图获取的省市名称统一转化

const wxPro = [ '北京', '上海', '天津', '重庆', '西藏', '广西', '内蒙古', '宁夏', '新疆' ]; // 直辖市
const gdPro = [ '北京市', '上海市', '天津市', '重庆市', '西藏自治区', '广西壮族自治区', '内蒙古自治区', '宁夏回族自治区', '新疆维吾尔自治区' ];
module.exports = {
  formart(province) {
    if (province) {
      for (let i = 0; i < wxPro.length; i++) {
        if (province === wxPro[i]) {
          return gdPro[i];
        }
      }
      return province + '省';

    }
    return '';

  },
};
