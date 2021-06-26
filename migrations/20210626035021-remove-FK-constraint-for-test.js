'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Restaurants',
      'Restaurants_CategoryId_foreign_idx')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Restaurants', {
      fields: ['CategoryId'],
      type: 'foreign key',
      name: 'Restaurants_CategoryId_foreign_idx',
      references: {
        table: 'Categories',
        field: 'id'
      }
    });
  }
};