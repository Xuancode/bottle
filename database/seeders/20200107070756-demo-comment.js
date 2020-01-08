'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('comment', [{
        content: '天将降大任于斯人也',
        is_delete: 0,
        created_at: new Date(),
        updated_at: new Date(),
        parents_id: null,
        list_id: 1,
        user_id: 1
      },{
        content: '天将降大任于斯人也',
        is_delete: 0,
        created_at: new Date(),
        updated_at: new Date(),
        parents_id: 1,
        list_id: 1,
        user_id: 1
      },{
        content: '天将降大任于斯人也',
        is_delete: 0,
        created_at: new Date(),
        updated_at: new Date(),
        parents_id: 2,
        list_id: 2,
        user_id: 2
      },{
        content: '天将降大任于斯人也',
        is_delete: 0,
        created_at: new Date(),
        updated_at: new Date(),
        parents_id: null,
        list_id: 3,
        user_id: 3
      }], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('comment', null, {});

  }
};