// routes/checkin.js
const express = require('express');
const router = express.Router();
const knex = require('../knex');
const { updateState } = require('../utils');

//backend logic to update the current streak  
//based on the user's check in
router.post('/:id', async (req, res) => {
    const { id } = req.params;
    const { smoke_free_today, smoke_free_yesterday } = req.body;
  
    try {
      const { currentStreak: initialStreak, user } = await updateState(id);
      
      let updatedFields = {};
      let currentStreak = initialStreak;
  
      if (typeof smoke_free_yesterday !== 'undefined') {
        //There is a small inconsistency in this part of the algorithm which may lead to confusion:
        //if the user reports they smoked today, the current_streak will go to 0, but then if
        //later on the same day they later report they did not smoke yesterday, it will increase to 1
          updatedFields.smoke_free_yesterday = smoke_free_yesterday;
          currentStreak = (!smoke_free_yesterday) ? 0 : user.saved_streak + 1 + (Boolean(user.smoke_free_today) ? 1 : 0);
      }
  
      if (typeof smoke_free_today !== 'undefined') {
          updatedFields.smoke_free_today = smoke_free_today;
          currentStreak = (!smoke_free_today) ? 0 : 1;
          if (smoke_free_today && Boolean(user.smoke_free_yesterday)) {
            currentStreak += user.saved_streak + 1;
          }
      }
      const streak_increased = (currentStreak > user.current_streak);
      updatedFields.current_streak = currentStreak;
      updatedFields.last_checkin_date = new Date().toISOString().split('T')[0];
      updatedFields.max_streak = Math.max(user.max_streak, currentStreak);
  
      await knex('users').where({ id }).update(updatedFields);
  
      res.status(200).send({ message: 'Check-in successful', current_streak: currentStreak,
        streak_increased: streak_increased, success: true});
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error' });
    }
});

module.exports = router;