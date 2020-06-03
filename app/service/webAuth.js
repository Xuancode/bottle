const Service = require('egg').Service

const short = require('short-uuid');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}


class WebAuthService extends Service {
  async getUserByCode(code) {
    const {ctx} = this
    const {appid, secretid} = this.config.weChat[ctx.request.body.type]
    const result = await this.ctx.curl(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secretid}&code=${code}&grant_type=authorization_code`, { method: 'GET', dataType: 'json' })
    let user = null
    if (result.data.errcode) {
      ctx.body = { ...this.app.resCode['REMOTE_ERR'], more_msg: result.data}
      return
    } else {
      result.data.type = ctx.request.body.type
      user = await ctx.service.webAuth.creatOrUpdateWechatByHasUnionid(result.data.openid, result.data)
      return user
    }
  }
  
  /**creatOrUpdateWechatByHasUnionid 后续要使用事务; 返回user */
  async creatOrUpdateWechatByHasUnionid(openid, data) {
    // 查询wechat数据库是否存在该openid的用户，不存在就新建后执行登录，存在则更新信息后直接执行登录
    const {ctx} = this
    const {session_key, refresh_token, access_token, is_focus, type, unionid} = data
    let tempObj = {session_key, refresh_token, access_token, is_focus, type}
    tempObj = ctx.helper.fliterUndefinedParams(tempObj)
    console.log(tempObj)
    let wechatRes = await ctx.model.Wechat.findOne({where: {openid}})
    console.log('没走出这步')
    // , attributes: ['openid']
    let user = null

    // 事务开始
    const Op = this.app.Sequelize.Op
    let transaction = null
    let unionRes = null
    let userRes = null
    try {
      transaction = await this.ctx.model.transaction()
      // 已存在，更新wecaht表, 不存在则新建
      if (wechatRes) {
        console.log('有wechatRes')
        await ctx.model.Wechat.update({...tempObj}, {where: {openid}}, {transaction})
      } else {
        console.log('无wechatRes')
        wechatRes = await ctx.model.Wechat.create({ openid, ...tempObj}, { transaction })
      }
      // 不存在union则新建
      console.log('准备创建unionRes')
      // console.log(ctx.model)
      unionRes = await ctx.model.Union.findOne({ where: {unionid}}, { transaction })

      console.log('准备创建unionRes没走出来？')
      console.log(unionRes)

      // 按照设计，有union一定关联了user；没有union还要新建user并且关联
      if (!unionRes) {
        unionRes = await ctx.model.Union.create({openid, unionid}, { transaction })
        console.log('名字', ctx.service.user.createNickName())
        userRes = await ctx.model.User.create({name: ctx.service.user.createNickName(), user_id: ctx.service.user.createUid()}, { transaction })
        await unionRes.setUsers([userRes], {transaction})
        // 关联user
      }
      // union关联wechat
      await unionRes.setWechats([wechatRes], {transaction})

      await transaction.commit()
      ctx.body = {...this.app.resCode['SUCCESS'], msg: '新建成功'}
    } catch (error) {
      console.log('错了')
      console.log(error)
      await transaction.rollback()
      ctx.body = {...this.app.resCode['ERROR'], msg: '新建失败'}
    }

    


    // if (res) {
    //   // 已存在，更新wecaht表
    //   await ctx.model.Wechat.update({...tempObj}, {where: {openid}})

    //   // 
    //   ctx.service.Union.createUnionByOpenid(openid, unionid)

    //   user = await ctx.model.User.findOne({where: {user_id: res.user_id}})
    // } else {
    //   // 不存在，新建用户、wechat信息
    //   let nickName = 'ID' + Math.round(Math.random()*1000000)
    //   // 使用事务新建
    //   const Op = this.app.Sequelize.Op
    //   let transaction = null
    //   try {
    //     transaction = await this.ctx.model.transaction();
    //     user = await ctx.model.User.create({
    //       name: nickName,
    //       user_id: short.generate(),   // 生成唯一id
    //     }, { transaction })
    //     await ctx.model.Wechat.create({
    //       openid: openid,
    //       user_id: user.user_id,
    //       ...tempObj
    //     }, { transaction })
    //     await transaction.commit()
    //     return user
    //   } catch (error) {
    //     await transaction.rollback()
    //     ctx.body = {...this.app.resCode['ERROR'], msg: '新建失败'}
    //     return {msg: '新建失败'}
    //   }
    // }



    return user
  }
  
  createUserByUnionid() {
    
  }
}
module.exports = WebAuthService