/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Purge ALL existing entries
  await knex('users').del()
  //Then add new ones
  await knex('users').insert([
    {id: 1, name: 'Billy', max_streak: 0},
    {id: 2, name: 'Bob', max_streak: 0},
    {id: 3, name: 'Joe', max_streak: 0}
  ]);
};
