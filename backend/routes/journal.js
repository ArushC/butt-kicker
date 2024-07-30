// backend/routes/journal.js
const express = require('express');
const router = express.Router();
const { getJournalEntry, saveJournalEntry, getJournalEntryDates } = require('../controllers/journalController');

//this route MUST come before get to /:id/:date, as routes are processed from top to bottom
router.get('/:id/dates', getJournalEntryDates);

router.get('/:id/today', getJournalEntry);
router.post('/:id/today', saveJournalEntry);
router.get('/:id/:date', getJournalEntry);


module.exports = router;