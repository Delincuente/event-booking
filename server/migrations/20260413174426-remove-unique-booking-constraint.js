'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Bookings', 'bookings_user_event_unique');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addIndex('Bookings', ['userId', 'eventId'], {
      unique: true,
      name: 'bookings_user_event_unique'
    });
  }
};
