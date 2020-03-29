// 定义token
const JWT = require('jsonwebtoken');
const qiniu = require('qiniu');

// console.log(app.config)

// 七牛相关token
var accessKey = '123';
var secretKey = '123';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

module.exports = {
  async initToken(data, expires = 7200) {
    const exp = Math.floor(Date.now() / 1000) + expires
    const cert = '123'
    // const cert = fs.readFileSync(path.join(__dirname, '../public/rsa_private_key.pem')) // 自己生成
    const token = JWT.sign( data, cert, { expiresIn: 60 * 60 * 24 * 7 })
    return token
  },

  async resolveToken(token) {
    // const cert = fs.readFileSync(path.join(__dirname, '../public/rsa_public_key.pem')) // 公钥，看后面生成方法
    const cert = '123'
    var res = ''
    try {
      // const result = jwt.verify(token, cert, { algorithms: [ 'RS256' ] }) || {}
      // console.log(token)
      
      const result = JWT.verify(token, cert) || {}
      // console.log(99)
      // console.log(result)
      
      const { exp } = result
      const current = Math.floor(Date.now() / 1000)
      if (current <= exp) {
        
        res = result
      } else {
        res = ''
      }
    } catch (e){
      console.log('错误', e)
    }
    return res
  },

  // http返回便捷
  jsonSuccess() {
    return {msg: "success!", errCode: 0}
  },

  // 七牛云token生成
  initQiniuToken() {
    //自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
    var options = {
      scope: 'ps-please-dev',
      expires: 60 * 60 * 2
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    return uploadToken
  }
}