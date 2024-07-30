// backend/controllers/journalController.js
const knex = require('../knex'); // Adjust the path to where you export knex

exports.getJournalEntry = async (req, res) => {
  const { id, date } = req.params;
  const entry_date = date === undefined ? new Date().toLocaleDateString() : new Date(date).toLocaleDateString();

  try {
    const entry = await knex('journal_entries').where({ user_id: id, entry_date }).first();
    res.json(entry || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journal entry' });
  }
};

exports.saveJournalEntry = async (req, res) => {
  const { id } = req.params;
  const { entry } = req.body;
  const entry_date = new Date().toLocaleDateString();

  try {
    const existingEntry = await knex('journal_entries').where({ user_id: id, entry_date }).first();

    if (existingEntry) {
      await knex('journal_entries').where({ user_id: id, entry_date }).update({ entry });
    } else {
      await knex('journal_entries').insert({ user_id: id, entry_date, entry });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save journal entry' });
  }
};

exports.getJournalEntryDates = async (req, res) => {
    const { id } = req.params;
  
    try {
      const entries = await knex('journal_entries')
        .where({ user_id: id })
        .select('entry_date');
      const dates = entries.map(entry => entry.entry_date);
      res.json(dates);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch journal entry dates' });
    }
  };