// 'use strict';

// module.exports = {
//   // 在执行数据库升级时调用的函数，创建 users 表
//   up: async (queryInterface, Sequelize) => {
//     // const { INTEGER, DATE, STRING } = Sequelize;
//     await queryInterface.bulkInsert('user', {
//       // id: 1,
//       name: '禤品朗',
//       // created_at: DATE,
//       // updated_at: DATE,
//       created_at:new Date(),
//       updated_at:new Date(),
//       phone: '189222'
//     });
//   },
//   // 在执行数据库降级时调用的函数，删除 users 表
//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.bulkInsert('user', null, {});
//   },
// };

'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('user', [{
        name: '禤品朗',
        created_at:new Date(),
        updated_at:new Date(),
        phone: '189222'
      },{
        name: '禤品朗2',
        created_at:new Date(),
        updated_at:new Date(),
        phone: '189222'
      }], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('user', null, {});

  }
};