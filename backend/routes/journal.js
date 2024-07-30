// backend/routes/journal.js
const express = require('express');
const router = express.Router();
const { getJournalEntry, saveJournalEntry } = require('../controllers/journalController');

router.get('/:id/today', getJournalEntry);
router.post('/:id/today', saveJournalEntry);

module.exports = router;