exports.up = function(knex) {
    return knex.schema.table('users', function(table) {
      table.string('username').defaultTo('default_username'); // Temporarily set a default value
      table.string('password').defaultTo('default_password'); // Temporarily set a default value
    }).then(() => {
      return knex('users').update({
        username: knex.raw('substr(username, instr(username, "default_username") + 16)'),
        password: knex.raw('substr(password, instr(password, "default_password") + 16)')
      });
    }).then(() => {
      return knex.schema.alterTable('users', function(table) {
        table.string('username').notNullable().alter();
        table.string('password').notNullable().alter();
      });
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
      table.dropColumn('username');
      table.dropColumn('password');
    });
  };