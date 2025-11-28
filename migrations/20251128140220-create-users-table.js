'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      userID: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      email: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      isPremium: { type: Sequelize.BOOLEAN, defaultValue: false },
      premiumExpiry: { type: Sequelize.DATE, allowNull: true },
      supportNumber: { type: Sequelize.STRING, allowNull: true },
      paymentStatus: { type: Sequelize.STRING, defaultValue: 'pending' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
