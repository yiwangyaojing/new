import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    //  首页的状态以及数据
    home: {
      data: {
        team_id: [], // 团队 id
        team_info: [], // 团队详细信息
        team_user: [], // 团队成员
        plan_info: [], // 历史项目数据
        over_info: [] // 逾期数据
      }, // 从服务器获取到的信息(团队列表,历史项目,团队成员,逾期数据)---该数据是全部的数据
      choose_info: {
        open_id: 0,
        team_id: [],
        user_id: 0,
        time: []
      }, // 页面所选择的-里层数据(是否选择的是自己,团队,负责人,及其时间)---该数据是筛选条件,记录用户操作的状态
      show_info: {
        open_name: '',
        team_name: '',
        user_name: '全部(可见范围)',
        time: [],
        min_time: '累计'
      }, // 页面所选择的-表层数据(是否选择的是自己,团队,负责人,及其时间)---该数据是页面显示的数据,与 choose_info 数据配套
      isLive: false, // 是否有状态缓存
      isStart: false // 是否开始搜索
    },
    //  进度详情页的状态以及数据
    settingDetails: {
      form: '', // 从哪里跳转过来的
      start: false // 是否有缓存搜索
    },
    //  客户详情页的状态
    customerData: {
      parameter: {}, // 内部里层数据
      show_info: {}, // 外部表层数据
      isLive: false, // 是否有状态缓存
      isStart: false, // 是否开始搜索
      isRank: false // 是否是管理员
    }
  }
})

export default store
