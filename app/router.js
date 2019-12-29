'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/user/:id', controller.user.info);
  router.post('/user', app.controller.user);
  router.get('/search', app.controller.search.index);
  router.post('/form', app.controller.form.post);
  
};
