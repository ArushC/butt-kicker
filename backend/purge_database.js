const knex = require('./knex'); // Import the Knex instance configured by knex.js

async function purgeDatabase() {
  try {
    // Purge ALL existing entries in all tables
    await knex('users').del();
    await knex('cities').del();
    await knex('chat_messages').del();
    await knex('journal_entries').del();
    await knex('positive_reinforcement_messages').del();

    console.log(`Database purged successfully in ${process.env.NODE_ENV || 'development'} environment`);
  } catch (error) {
    console.error(`Error purging database in ${process.env.NODE_ENV || 'development'} environment:`, error);
  } finally {
    // Destroy the knex instance to close the connection
    await knex.destroy();
  }
}

purgeDatabase();