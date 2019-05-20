'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Polls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      answers: {
        type: Sequelize.JSON
      },
      color_scheme: {
        type: Sequelize.INTEGER
      },
      finish_date: {
        type: Sequelize.DATE
      },
      title: {
        type: Sequelize.STRING
      },
      votes_counter: {
        type: Sequelize.INTEGER
      },
      percentage: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Polls');
  }
};