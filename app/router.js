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
  //登录
  router.resources('/api/v1/session', app.controller.session);

  // 获取bottle相关
  router.resources('/api/v1/bottle', app.controller.bottle);

  // 评论相关
  router.resources('/api/v1/comment', app.controller.comment);

  // 上传图片
  router.resources('/api/v1/qiniu', app.controller.qiniu);



};
