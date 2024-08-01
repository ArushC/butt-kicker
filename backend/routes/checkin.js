// routes/checkin.js
const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.post('/:id', async (req, res) => {
    const { id } = req.params;
    const { smoke_free_today, smoke_free_yesterday } = req.body;
  
    try {
      const user = await knex('users').where({ id }).first();
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      const lastCheckInDate = new Date(user.last_checkin_date);
      const today = new Date();
      const oneDayInMillis = 24 * 60 * 60 * 1000;
      const daysSinceLastCheckIn = Math.floor((today - lastCheckInDate) / oneDayInMillis);
  
      let updatedFields = {};
      let currentStreak = user.current_streak;
  
      if (daysSinceLastCheckIn > 2) {
        updatedFields = {
          current_streak: 0,
          smoke_free_yesterday: false,
          smoke_free_today: false,
          saved_streak: currentStreak,
        };
      } else if (daysSinceLastCheckIn === 0) {
        // No change needed
      } else if (daysSinceLastCheckIn === 1 || daysSinceLastCheckIn === 2) {
        if (!user.smoke_free_yesterday) {
          updatedFields.saved_streak = 0;
        }
        updatedFields.smoke_free_yesterday = user.smoke_free_today;
        updatedFields.smoke_free_today = false;
      }
  
      if (typeof smoke_free_yesterday !== 'undefined') {
        if (user.smoke_free_yesterday !== smoke_free_yesterday) {
          updatedFields.smoke_free_yesterday = smoke_free_yesterday;
          if (!smoke_free_yesterday) {
            currentStreak = 0;
          } else {
            currentStreak = user.saved_streak + 1 + (user.smoke_free_today ? 1 : 0);
          }
        }
      }
  
      if (typeof smoke_free_today !== 'undefined') {
        if (user.smoke_free_today !== smoke_free_today) {
          updatedFields.smoke_free_today = smoke_free_today;
          if (!smoke_free_today) {
            currentStreak = 0;
          } else {
            if (!user.smoke_free_yesterday) {
              currentStreak = 1;
            } else {
              currentStreak = user.saved_streak + 2;
            }
          }
        }
      }
  
      updatedFields.current_streak = currentStreak;
      updatedFields.last_checkin_date = today.toISOString().split('T')[0];
      updatedFields.max_streak = Math.max(user.max_streak, currentStreak);
  
      await knex('users').where({ id }).update(updatedFields);
  
      res.status(200).send({ message: 'Check-in successful', current_streak: currentStreak });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error' });
    }
  });

module.exports = router;