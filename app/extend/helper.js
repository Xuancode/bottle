// 定义token
exports.initToken = (data, expires = 7200) => {
  const JWT = require('jsonwebtoken');
  const exp = Math.floor(Date.now() / 1000) + expires
  const cert = '9988xuanpinlang'
  // const cert = fs.readFileSync(path.join(__dirname, '../public/rsa_private_key.pem')) // 自己生成
  const token = JWT.sign({ data, exp }, cert)
  return token
}