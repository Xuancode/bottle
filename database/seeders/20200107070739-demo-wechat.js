'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('wechat', [{
        session_key: '11a23sd1f35a',
        openid: 465465,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 1
      },{
        session_key: 'q7q77777',
        openid: 7777777,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 2
      },{
        session_key: 'abc8888888',
        openid: 555555,
        created_at: new Date(),
        updated_at: new Date(),
        user_id: 3
      }], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('wechat', null, {});

  }
};