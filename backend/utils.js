// utils.js
const knex = require('./knex');

//helper function to calculate number of days between two dates
function calculateDaysDifference(date1, date2) {
  const date1ISO = new Date(date1.toISOString().split('T')[0]);
  const date2ISO = new Date(date2.toISOString().split('T')[0]);
  const oneDayInMillis = 24 * 60 * 60 * 1000;
  return Math.floor((date2ISO - date1ISO) / oneDayInMillis);
}

//backend logic to update the user's smoked_free_today,
//smoke_free_yesterday, saved_streak, and current_streak fields based   
//on the current date and when they last checked in
const updateState = async (id) => {
  const user = await knex('users').where({ id }).first();

  if (!user) {
    throw new Error('User not found');
  }

  const lastCheckInDate = new Date(user.last_checkin_date);
  const today = new Date();
  
  const daysAgoLastCheckIn = calculateDaysDifference(lastCheckInDate, today);
  
  let updatedFields = {};
  let currentStreak = user.current_streak;

  if (daysAgoLastCheckIn > 2) { // C3
    updatedFields = {
      current_streak: 0,
      smoke_free_yesterday: false,
      smoke_free_today: false,
      saved_streak: 0,
      last_checkin_date: today.toISOString().split('T')[0]
    };
  } else if (daysAgoLastCheckIn === 1) { // C1
    updatedFields = {
      smoke_free_yesterday: user.smoke_free_today,
      smoke_free_today: false,
      last_checkin_date: today.toISOString().split('T')[0],
      saved_streak: (!Boolean(user.smoke_free_yesterday)) ? 0 : user.saved_streak + 1
    };
    updatedFields.current_streak = (Boolean(updatedFields.smoke_free_yesterday)) ? 
      (updatedFields.saved_streak + 1) : 0;
  } else if (daysAgoLastCheckIn === 2) { // C2
    updatedFields = {
      current_streak: 0,
      smoke_free_yesterday: false,
      smoke_free_today: false,
      last_checkin_date: today.toISOString().split('T')[0],
      saved_streak: (!Boolean(user.smoke_free_today) || !Boolean(user.smoke_free_yesterday)) ? 0 : user.saved_streak + 2
    };
  }

  // Update the database with the updated fields only if there are changes
  if (Object.keys(updatedFields).length > 0) {
    await knex('users').where({ id }).update(updatedFields);
  }

  return { currentStreak, user };
};


module.exports = { updateState };