exports.seed = async function(knex) {
    // Journal entries to be added
    const journalEntries = [
      { user_id: 1, entry_date: new Date('2024-07-26').toISOString().split('T')[0], entry: 'Had a great day working on my project. Made some good progress!' },
      { user_id: 1, entry_date: new Date('2024-07-28').toISOString().split('T')[0], entry: 'Feeling a bit tired today. Need to get more sleep.' },
      { user_id: 2, entry_date: new Date('2024-07-29').toISOString().split('T')[0], entry: 'Busy day at work. Managed to finish all my tasks.' },
      { user_id: 2, entry_date: new Date('2024-07-27').toISOString().split('T')[0], entry: 'Took a long walk in the park. It was refreshing.' },
      { user_id: 3, entry_date: new Date('2024-07-28').toISOString().split('T')[0], entry: 'Did some reading and had a quiet day.' },
      { user_id: 3, entry_date: new Date('2024-07-26').toISOString().split('T')[0], entry: 'Worked on a new hobby project. Feeling excited about it!' }
    ];
  
    // Fetch existing journal entries
    const existingEntries = await knex('journal_entries').select('user_id', 'entry_date', 'entry');
  
    // Filter out entries that already exist
    const newEntries = journalEntries.filter(entry => 
      !existingEntries.some(existingEntry => 
        existingEntry.user_id === entry.user_id &&
        existingEntry.entry_date === entry.entry_date &&
        existingEntry.entry === entry.entry
      )
    );
  
    // Insert new journal entries
    if (newEntries.length > 0) {
      await knex('journal_entries').insert(newEntries);
    }
};