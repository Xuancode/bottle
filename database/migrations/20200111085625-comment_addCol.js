'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('comment', 'completed_img', {
      type: Sequelize.STRING,
      defaultValue: ''
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('comment', 'completed_img')
  }
};
