/**
 * JS当中定义的静态变量
 */
export default {
  storage: {
    user: 'user', // 用户登录成功缓存key
    csrfToken: 'backendcsrfToken'// cookie当中存放的值key
  },
  gender: [{ name: '男', value: '男' }, { name: '女', value: '女' }],
  bool: [{ name: '是', value: '是' }, { name: '否', value: '否' }]
}
