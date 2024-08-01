// routes/checkin.js
const express = require('express');
const router = express.Router();

router.post('/:id', (req, res) => {
  const { id } = req.params;
  const { smoked_today, smoked_yesterday } = req.body;

  // Handle the check-in logic here
  // Example:
  if (typeof smoked_today !== 'undefined') {
    console.log(`User ${id} smoked today: ${smoked_today}`);
  } else if (typeof smoked_yesterday !== 'undefined') {
    console.log(`User ${id} smoked yesterday: ${smoked_yesterday}`);
  }

  res.status(200).send({ message: 'Check-in successful' });
});

module.exports = router;