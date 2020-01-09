const Service = require('egg').Service;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class ListService extends Service {
  async getList(type, page, size) {
    type = toInt(type) 
    page = toInt(page)
    size = toInt(size)
    let ctx = this.ctx
    // 0为未完成， 1为推荐， 2为自我
    switch(type){
      case 0: {
        console.log('飞法法')
        const resData = await ctx.model.List.findAndCountAll({
          attributes: ['id', 'title', 'src_img', 'updated_at'],
          // where: { is_delete: 0, user_id: {$not: null}},
          order: [['updated_at', 'DESC']],
          limit: size,
          offset: size * (page -1)
        })
        let pagination = {
          total: resData.count,
          count: resData.rows.length,
          size: size,
          page: page,
          total_pages: parseInt((resData.count + size -1 ) / size) ,
        }
        return {data: resData.rows, meta: {pagination: pagination}}
      }
      case 1: {

      }
      case 2: {

      }
    }


  }

  // async login(uid) {
  //   const data = {
  //     uid: uid
  //   }
  //   const token = await this.ctx.helper.initToken(data, 7200)
  //   return token
  // }
}
module.exports = ListService;