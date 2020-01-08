'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('list', [{
        title: '好雨知时节',
        src_img: 'http://molitown.cn/img/dataImg/pic20.jpg',
        side_imgs: 'http://molitown.cn/img/dataImg/pic20.jpg,http://molitown.cn/img/dataImg/pic20.jpg',
        is_delete: 0,
        user_id: 1,
        editor_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },{
        title: '当春乃发生',
        src_img: 'http://molitown.cn/img/dataImg/pic20.jpg',
        side_imgs: 'http://molitown.cn/img/dataImg/pic20.jpg,http://molitown.cn/img/dataImg/pic20.jpg',
        is_delete: 1,
        user_id: 1,
        editor_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },{
        title: '随风潜入夜',
        src_img: 'http://molitown.cn/img/dataImg/pic20.jpg',
        side_imgs: 'http://molitown.cn/img/dataImg/pic20.jpg,http://molitown.cn/img/dataImg/pic20.jpg',
        is_delete: 0,
        user_id: 2,
        editor_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      }], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('list', null, {});

  }
};