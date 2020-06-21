/*
 * @Author: xuanpl
 * @Date: 2020-02-18 11:40:47
 * @LastEditors: xuanpl
 * @LastEditTime: 2020-06-18 13:34:39
 * @Description: file content
 * @FilePath: /bottle/app/extend/helper.js
 */
// 定义token
const JWT = require('jsonwebtoken')
const qiniu = require('qiniu')

module.exports = {
  async initToken(data, expiresIn = 7200) {
    const cert = this.config.jwt.cert
    // const cert = fs.readFileSync(path.join(__dirname, '../public/rsa_private_key.pem')) // 自己生成
    const token = JWT.sign(data, cert, { expiresIn: expiresIn })
    return token
  },

  async resolveToken(token) {
    // const cert = fs.readFileSync(path.join(__dirname, '../public/rsa_public_key.pem')) // 公钥，看后面生成方法
    const cert = this.config.jwt.cert
    var res = ''
    try {
      const result = JWT.verify(token, cert) || {}
      const { exp } = result
      const current = Math.floor(Date.now() / 1000)
      if (current <= exp) {
        res = result
      } else {
        res = ''
      }
    } catch (e) {
      console.log('错误', e)
    }
    return res
  },

  // http返回便捷
  jsonSuccess() {
    return { msg: 'success!', code: 20000 }
  },

  // http返回便捷
  jsonError() {
    return { msg: 'err!', errCode: 1 }
  },

  // 七牛云token生成
  initQiniuToken() {
    const ctx = this.ctx
    const accessKey = ctx.app.config.qiniu.AK
    const secretKey = ctx.app.config.qiniu.SK
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

    //自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
    const options = {
      scope: 'ps-please-dev',
      expires: 60 * 60 * 2,
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(mac)
    return uploadToken
  },

  /** 过滤obj对象中key值的为undefined的key，参数空是可以留下的 */
  fliterUndefinedParams(tempObj) {
    let obj = {}
    for (let key in tempObj) {
      if (tempObj[key] != undefined) {
        obj[key] = tempObj[key]
      }
    }
    return obj
  },

  /** 过滤obj对象中key值的为非的key，参数空不可留下 */
  fliterFalseParams(tempObj) {
    let obj = {}
    for (let key in tempObj) {
      if (tempObj[key]) {
        obj[key] = tempObj[key]
      }
    }
    return obj
  },
  /** 生成item_id */
  createItemID() {
    let time = new Date()
    return time.getTime() - 1570000000000 // 减去前三位，再在首位+1作为itemID
  },
  /** 去重 */
  removeRepeat(arr, key) {
    let result = []
    let temp = {}
    arr.forEach((item) => {
      if (!temp[item[key]]) {
        result.push(item)
        temp[item[key]] = true
      }
    })
    return result
  },
}
