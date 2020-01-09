// 定义token
const JWT = require('jsonwebtoken');

module.exports = {
  async initToken(data, expires = 7200) {
    const exp = Math.floor(Date.now() / 1000) + expires
    const cert = '9988xuanpinlang'
    // const cert = fs.readFileSync(path.join(__dirname, '../public/rsa_private_key.pem')) // 自己生成
    const token = JWT.sign( data, cert, { expiresIn: 60 * 60 * 2 })
    return token
  },

  async resolveToken(token) {
    // const cert = fs.readFileSync(path.join(__dirname, '../public/rsa_public_key.pem')) // 公钥，看后面生成方法
    const cert = '9988xuanpinlang'
    var res = ''
    try {
      // const result = jwt.verify(token, cert, { algorithms: [ 'RS256' ] }) || {}
      console.log(token)
      
      const result = JWT.verify(token, cert) || {}
      console.log(99)
      console.log(result)

      const { exp } = result
      const current = Math.floor(Date.now() / 1000)
      if (current <= exp) {
        
        res = result
      } else {
        res = ''
      }
    } catch (e){
      console.log(e)
    }
    return res
  }
}