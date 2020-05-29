'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

// Access-Control-Allow-Origin：*

module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.resources('/user', app.controller.user);
  router.get('/search', app.middleware.uppercase(), app.controller.search.index); // 使用中间件
  router.post('/form', app.controller.form.post);
  router.redirect('/reto', '/user/9', 302); // 内部重定向
  router.get('/reto2', app.controller.search.redirect); // 外部重定向


  /**
   * 正式开始
   */
  // 管理员
  router.resources('/api/v1/login', app.controller.login);
  router.post('/api/v1/logout', app.controller.login.logout);
  router.resources('/api/v1/admin', app.controller.admin);
  router.resources('/api/v1/permisson', app.controller.permission);
  router.resources('/api/v1/role', app.controller.role);

  // 项目
  router.resources('/api/v1/item', app.controller.item);

  //登录
  router.resources('/api/v1/session', app.controller.session);
  router.resources('/api/v1/webAuth', app.controller.webAuth);

  // 获取bottle相关
  router.resources('/api/v1/bottle', app.controller.bottle);
  
  /**有心影视 公众号 */
  // token
  router.resources('/api/v1/weChatReply', app.controller.weChatReply)
  router.resources('/api/v1/youxin/movie', app.controller.youxinMovie)
  router.post('/api/v1/youxin/uploadExcle', app.controller.youxinMovie.uploadExcle)
  router.get('/api/v1/youxin/movie/checkName', app.controller.youxinMovie.checkName)

  // 临时的
  router.resources('/api/v1/youxin/temp', app.controller.temp)
  // router.get('/api/v1/youxin/temp/user_info', app.controller.temp.user_info)

  /**
   * 公众号相关
   */
  // 询问微信相关的信息
  // router.resources('/api/v1/askWechat', app.controller.askWechat)
  router.resources('/api/v1/room', app.controller.room.room)
  router.get('/api/v1/room/canSee', app.controller.room.room.canSee)
  // 自动回复
  router.resources('/api/v1/weChat/reply', app.controller.weChat.autoReply)
  

  // 评论相关
  // router.resources('/api/v1/comment', app.controller.comment);

  // 上传图片
  // router.resources('/api/v1/qiniu', app.controller.qiniu);



}
