// backend/routes/journal.js
const express = require('express');
const router = express.Router();
const { getJournalEntry, saveJournalEntry, getJournalEntryDates } = require('../controllers/journalController');

router.get('/:id/today', getJournalEntry);
router.post('/:id/today', saveJournalEntry);
router.get('/:id/:date', getJournalEntry);
router.get('/:id/dates', getJournalEntryDates);

module.exports = router;