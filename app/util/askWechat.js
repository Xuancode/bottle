/*
 * @Author: xuanpl
 * @Date: 2020-06-16 19:38:28
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-16 19:44:56
 * @Description: file content
 * @FilePath: /bottle/app/util/askWechat.js
 */ 
module.exports = {
  /**
   * 
   * @param {object} that this
   * @param {string} type app类型
   * @param {string} openid app的openid
   */
  async getUserInfo(that, type, openid) {
    const { ctx } = that
    let result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${ctx.app.Cache.get(type)}&openid=${openid}&lang=zh_CN`, { method: 'GET', dataType: 'json' })
    ctx.logger.info('第一次获取: %j', result.data)
    if (!result.errcode) {
      return result.data
    } else if (result.errcode == 40001) {
      await getAccessTokenByAppType(that, type)
      result = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${ctx.app.Cache.get(type)}&openid=${openid}&lang=zh_CN`, { method: 'GET', dataType: 'json' })
      ctx.logger.info('第二次获取: %j', result.data)
      if (!result.errcode) {
        return result.data
      } else {
        ctx.logger.info('res.errcode: %j', res.errcode)
        ctx.logger.info('res.errmsg: %j', res.errmsg)
        throw new Error(res.errcode + res.errmsg)
      }
    } else {
      ctx.logger.info('res.errcode: %j', res.errcode)
      ctx.logger.info('res.errmsg: %j', res.errmsg)
      throw new Error(res.errcode + res.errmsg)
    }
  },
  /**
   * 
   * @param {object} that this
   * @param {string} type app类型，110，210，310等
   */
  async getAccessTokenByAppType(that, type) {
    const { ctx } = that
    const ele = that.config.weChat[type]
    const res = await ctx.curl(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${ele.appid}&secret=${ele.secretid}`, {
      dataType: 'json',
      method: 'GET'
    })
    if (res && res.data && res.data.access_token) {
      ctx.app.Cache.set(type, res.data.access_token, 60 * 60) // 官方2小时有效，这里缩短为1小时
    } else {
      ctx.logger.info('res.errcode: %j', res.errcode)
      ctx.logger.info('res.errmsg: %j', res.errmsg)
      throw new Error(res.errcode + res.errmsg)
    }
  }
  // acync getUserInfo() { }
}