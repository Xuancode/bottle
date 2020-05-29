const Service = require('egg').Service;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class LoginRecordService extends Service {
  async countTimes(uid, typeArr) {
    const {ctx} = this
    const Op = this.app.Sequelize.Op
    return await ctx.model.Userlogin.count({where: {user_id: uid, type: {[Op.in]: typeArr}}})
  }
  async createRecord(data) {
    const {ctx} = this
    const { app_type } = ctx.request.body
    const type = ctx.request.body.login_type
    const { user_id } = data

    let tempObj = {type, app_type, user_id}
    tempObj = ctx.helper.fliterUndefinedParams(tempObj)
    const res = await ctx.model.Userlogin.create({...tempObj})
    return res
  }
}
module.exports = LoginRecordService