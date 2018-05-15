module.exports = {
  getUserInfo () {
    return JSON.parse(window.sessionStorage.getItem('user') || '{}')
  }
}
