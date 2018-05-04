export default {
  sizes: [10, 15, 50],
  layout: 'total, sizes, prev, pager, next, jumper',
  size: 15,
  response: function (data, response) {
    data.content = response.body.content
    data.page.total = response.body.totalElements
    data.page.page = response.body.number
    data.page.size = response.body.size
  }
}
