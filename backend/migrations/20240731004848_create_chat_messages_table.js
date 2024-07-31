exports.up = function(knex) {
    return knex.schema.createTable('chat_messages', function(table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.boolean('anonymous').defaultTo(false);
      table.text('message');
      table.timestamp('timestamp').defaultTo(knex.fn.now());
    });
  };
  
exports.down = function(knex) {
    return knex.schema.dropTable('chat_messages');
};