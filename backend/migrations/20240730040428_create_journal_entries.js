exports.up = function(knex) {
    return knex.schema.createTable('journal_entries', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').notNullable().onDelete('CASCADE');
      table.date('entry_date').notNullable();
      table.text('entry').notNullable();
      table.unique(['user_id', 'entry_date']);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('journal_entries');
  };