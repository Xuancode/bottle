module.exports = {
  'SUCCESS': {
    code: 20000,
    msg: '成功'
  },

  'SUCCESS&NOT': {
    code: 20040,
    msg: '请求成功，但是结果为否定'
  },

  'FAULT': {
    code: 40000,
    msg: '请求失败'
  },

  'UNAUTH': {
    code: 40001,
    msg: '未登录'
  },

  'PARAM_ERR': {
    code: 40010,
    msg: '参数错误'
  },

  'REMOTE_ERR': {
    code: 40020,
    msg: '远程服务错误'
  },

  'ERROR': {
    code: 50000,
    msg: '内部错误'
  }
}