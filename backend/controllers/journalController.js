const knex = require('../knex'); // Adjust the path to where you export knex

exports.getFormattedJournalEntries = async (req, res) => {
  const { id } = req.params;
  try {
    const entries = await knex('journal_entries')
      .select('entry_date', 'entry')
      .where('user_id', id)
      .orderBy('entry_date', 'desc')
      .limit(10);

    // Format the entries
    const formattedEntries = entries.map(entry => {
      const date = new Date(entry.entry_date).toISOString().split('T')[0];
      return `${date}:\n${entry.entry}`;
    }).join('\n\n');

    res.json({ journal: formattedEntries });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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
        if (!entry.trim()) { // Check if entry is null or whitespace, in which case it gets deleted
          await knex('journal_entries').where({ user_id: id, entry_date: isoDate }).del();
        } else {
          await knex('journal_entries').where({ user_id: id, entry_date: isoDate }).update({ entry });
        }
      } else {
        if (entry.trim()) {
          await knex('journal_entries').insert({ user_id: id, entry_date: isoDate, entry });
        }
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
  
      // Get current date in ISO format
      const currentDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
      // Create a new array with 'today' at the front
      const sortedDates = ['today']
        .concat(dates
          .filter(date => date !== currentDate) // Remove the current date from the list
          .sort((a, b) => b.localeCompare(a)) // Sort remaining dates in reverse order
        );
  
      console.log("Dates: ", sortedDates);
      res.json(sortedDates);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch journal entry dates' });
    }
  };