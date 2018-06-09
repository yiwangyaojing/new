'use strict';

const Service = require('egg').Service;

class AerialPcService extends Service {

  async save(params) {

    // 先保存航拍项目数据
    const aerialObj = {};
    aerialObj.project_name = params.projectName;
    aerialObj.linkman = params.linkman;
    aerialObj.phone = params.phone;
    aerialObj.mail = params.mail;
    aerialObj.remark = params.remark;
    if (this.ctx.session.user) {
      aerialObj.open_id = this.ctx.session.user.openid;
    } else {
      aerialObj.open_id = '用户未登陆';
    }
    const aerialResult = await this.ctx.model.AerialProject.create(aerialObj);

    // 根据项目id存文件
    for (let i = 0; i < params.file.length; i++) {
      const aerialFileObj = {};
      aerialFileObj.aerial_id = aerialResult.id;
      aerialFileObj.gps_altitude = params.file[i].GPSAltitude;
      aerialFileObj.gps_latitude = params.file[i].GPSLatitude;
      aerialFileObj.gps_longitude = params.file[i].GPSLongitude;
      aerialFileObj.file_name = params.file[i].fileName;
      aerialFileObj.oss_file_path = params.file[i].oss_file_name;
      aerialFileObj.oss_url = params.file[i].url;
      aerialFileObj.oss_bucket = params.file[i].bucket;

      await this.ctx.model.AerialFile.create(aerialFileObj);
    }

    return 'success';
  }
}
module.exports = AerialPcService;
