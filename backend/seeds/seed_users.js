/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const bcrypt = require('bcrypt');

exports.seed = async function(knex) {

  // Purge ALL existing entries
  await knex('users').del();

  // Then add new ones
  await knex('users').insert([
    { id: 1, name: 'Billy', username: 'billy', 
      password: await bcrypt.hash('test', 10), max_streak: 0, current_streak: 0 },
    { id: 2, name: 'Bob', username: 'bob', 
      password: await bcrypt.hash('test', 10), max_streak: 0, current_streak: 0 },
    { id: 3, name: 'Joe', username: 'joe', 
      password: await bcrypt.hash('test', 10), max_streak: 0, current_streak: 0 },
  ]);
};
