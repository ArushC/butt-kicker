const bcrypt = require('bcrypt');

exports.seed = async function(knex) {

  // Users to be added
  const users = [
    { id: 1, name: 'Billy', username: 'billy', 
      password: await bcrypt.hash('test', 10), max_streak: 0, 
      current_streak: 3, location: 'Berkeley' },
    { id: 2, name: 'Bob', username: 'bob', 
      password: await bcrypt.hash('test', 10), max_streak: 0, 
      current_streak: 0, location: 'Berkeley' },
    { id: 3, name: 'Joe', username: 'joe', password: await bcrypt.hash('test', 10), 
      max_streak: 0, current_streak: 0, location: 'Berkeley' },
  ];

  // Fetch existing usernames
  const existingUsernames = await knex('users').pluck('username');

  // Filter out users that already exist
  const newUsers = users.filter(user => !existingUsernames.includes(user.username));

  // Insert new users
  if (newUsers.length > 0) {
    await knex('users').insert(newUsers);
  }

};