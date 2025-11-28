'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Expenses', {
      expenseID: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userID: { type: Sequelize.INTEGER, allowNull: false, references: { model: 'Users', key: 'userID' }, onDelete: 'CASCADE' },
      amount: { type: Sequelize.FLOAT, allowNull: false },
      description: { type: Sequelize.STRING, allowNull: false },
      category: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Expenses');
  }
};
