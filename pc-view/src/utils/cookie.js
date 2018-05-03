export default {
  getCookie (name) {
    let cookies = document.cookie.split(';')
    let result = ''
    cookies.forEach((c) => {
      let a = c.split('=')
      if (a[0].trim() === name) {
        result = a[1]
      }
    })
    return result
  }
}
