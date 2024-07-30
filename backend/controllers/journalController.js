const knex = require('../knex'); // Adjust the path to where you export knex

exports.getJournalEntry = async (req, res) => {
  const { id, date } = req.params;
  // Convert date to ISO string
  const entry_date = date === undefined ? new Date().toISOString().split('T')[0] : new Date(date).toISOString().split('T')[0];

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
  
    // Convert today's date to ISO string format
    const isoDate = new Date().toISOString().split('T')[0];
  
    try {
      const existingEntry = await knex('journal_entries').where({ user_id: id, entry_date: isoDate }).first();
  
      if (existingEntry) {
        await knex('journal_entries').where({ user_id: id, entry_date: isoDate }).update({ entry });
      } else {
        await knex('journal_entries').insert({ user_id: id, entry_date: isoDate, entry });
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