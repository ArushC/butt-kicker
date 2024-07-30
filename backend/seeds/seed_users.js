const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

async function batchInsert(knex, table, data, batchSize = 100) {
  for (let i = 0; i < data.length; i += batchSize) {
    await knex(table).insert(data.slice(i, i + batchSize));
  }
}

exports.seed = async function(knex) {
  // Purge ALL existing entries
  await knex('users').del();
  await knex('cities').del();

  // Then add new users
  await knex('users').insert([
    { id: 1, name: 'Billy', username: 'billy', 
      password: await bcrypt.hash('test', 10), max_streak: 0, 
      current_streak: 3, location: 'Berkeley'},
    { id: 2, name: 'Bob', username: 'bob', 
      password: await bcrypt.hash('test', 10), max_streak: 0, 
      current_streak: 0, location: 'Berkeley' },
    { id: 3, name: 'Joe', username: 'joe', password: await bcrypt.hash('test', 10), 
      max_streak: 0, current_streak: 0, location: 'Berkeley' },
  ]);

  // Fetch cities data and process to remove duplicates
  const response = await fetch('https://countriesnow.space/api/v0.1/countries');
  const data = await response.json();
  const cities = data.data.reduce((acc, country) => acc.concat(country.cities), []);

  // Remove duplicates
  const uniqueCities = Array.from(new Set(cities));

  // Prepare data for insertion
  const citiesData = uniqueCities.map((city, index) => ({ id: index + 1, name: city }));

  // Insert unique cities data into the database in batches
  await batchInsert(knex, 'cities', citiesData);
};