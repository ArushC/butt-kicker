const bcrypt = require('bcrypt');
const fetch = require('node-fetch');

async function batchInsert(knex, tableName, data, batchSize = 100) {
  const chunkedData = [];
  for (let i = 0; i < data.length; i += batchSize) {
    chunkedData.push(data.slice(i, i + batchSize));
  }
  for (const chunk of chunkedData) {
    await knex(tableName).insert(chunk);
  }
}

exports.seed = async function(knex) {
  // Purge ALL existing entries
  await knex('users').del();
  await knex('cities').del();

  // Then add new ones
  await knex('users').insert([
    { id: 1, name: 'Billy', username: 'billy', 
      password: await bcrypt.hash('test', 10), max_streak: 0, current_streak: 0 },
    { id: 2, name: 'Bob', username: 'bob', 
      password: await bcrypt.hash('test', 10), max_streak: 0, current_streak: 0 },
    { id: 3, name: 'Joe', username: 'joe', 
      password: await bcrypt.hash('test', 10), max_streak: 0, current_streak: 0 },
  ]);

  // Fetch cities data and insert into the database in batches
  const response = await fetch('https://countriesnow.space/api/v0.1/countries');
  const data = await response.json();
  const cities = data.data.reduce((acc, country) => acc.concat(country.cities), []);

  const citiesData = cities.map((city, index) => ({ id: index + 1, name: city }));
  await batchInsert(knex, 'cities', citiesData);
};