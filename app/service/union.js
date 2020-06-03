const Service = require('egg').Service;
class UnionService extends Service {
  async createUnionByOpenid(openid, unionid) {
    const {ctx} = this
    return ctx.model.Union.findOrCreate({where: {openid}, defaults: {
      unionid,
      openid
    }})
  }
}
module.exports = UnionService