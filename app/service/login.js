const Service = require('egg').Service;

const appid = 'wx27d8d47c69b319c9';
const secretid = '3f27f2bb063daf2782fb754b5468c422';

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class LoginService extends Service {
  // 默认不需要提供构造函数。
  // constructor(ctx) {
  //   super(ctx); 如果需要在构造函数做一些处理，一定要有这句话，才能保证后面 `this.ctx`的使用。
  //   // 就可以直接通过 this.ctx 获取 ctx 了
  //   // 还可以直接通过 this.app 获取 app 了
  // }
  async getSession(wxcode) {
    // 请求小程序服务器拿到session
    const result = await this.ctx.curl(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secretid}&js_code=${wxcode}&grant_type=authorization_code
    `, { dataType: 'json' });
    console.log(result.data)
    // 报错处理
    // if (result.errcode != 0) {
    //     console.log(`错误正愁余${errcode}`)
    // }

    
      
    // 查询数据库是否存在该openid的用户，存在就返回信息， 不存在就新建后返回信息
    


    // {
    //     session_key: 'lBKKkgzd+G9huph7/XBgRA==',
    //     expires_in: 7200,
    //     openid: 'onFn-0Kfor16AOsFn8PMdBfeiDQw'
    //   }




    return result;
  }

//   async getPicture(uid) {
//     const result = await this.ctx.curl(`http://photoserver/uid=${uid}`, { dataType: 'json' });
//     return result.data;
//   }
}
module.exports = LoginService;