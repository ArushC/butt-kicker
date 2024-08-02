// utils.js
const knex = require('./knex');

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
  
    // Reset time to midnight for both dates to avoid time differences
    const lastCheckInISO = new Date(lastCheckInDate.toISOString().split('T')[0]);
    const todayISO = new Date(today.toISOString().split('T')[0]);
  
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    const daysAgoLastCheckIn = Math.floor((todayISO - lastCheckInISO) / oneDayInMillis);
  
    let updatedFields = {};
    let currentStreak = user.current_streak;
  
    if (daysAgoLastCheckIn >= 2) { //C3
      updatedFields = {
        current_streak: 0,
        smoke_free_yesterday: false,
        smoke_free_today: false,
        saved_streak: 0,
        last_checkin_date: todayISO.toISOString().split('T')[0]
      };
    } else if (daysAgoLastCheckIn === 1) { //C1
        updatedFields = {
            smoke_free_yesterday: user.smoke_free_today,
            smoke_free_today: false,
            last_checkin_date: todayISO.toISOString().split('T')[0],
            saved_streak: (!user.smoke_free_yesterday) ? 0 : user.saved_streak + 1
        }
        updatedFields.current_streak = (updatedFields.smoke_free_yesterday) ? 
        (updatedFields.saved_streak + 1) : 0;
    } else if (daysAgoLastCheckIn === 2) { //C2
        updatedFields = {
            current_streak: 0,
            smoke_free_yesterday: false,
            smoke_free_today: false,
            last_checkin_date: todayISO.toISOString().split('T')[0],
            saved_streak: (!user.smoke_free_today || !user.smoke_free_yesterday) ? 0 : user.saved_streak + 2
        }
    }
  
    // Update the database with the updated fields only if there are changes
    if (Object.keys(updatedFields).length > 0) {
        await knex('users').where({ id }).update(updatedFields);
    }
  
    return { currentStreak, user };
  };

module.exports = { updateState };