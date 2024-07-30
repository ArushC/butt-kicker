// backend/controllers/journalController.js
const knex = require('../knex'); // Adjust the path to where you export knex

exports.getJournalEntry = async (req, res) => {
  const { id } = req.params;
  const entry_date = new Date().toLocaleDateString();

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