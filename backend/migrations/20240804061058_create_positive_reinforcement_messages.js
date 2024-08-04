exports.up = function(knex) {
    return knex.schema.createTable('positive_reinforcement_messages', function(table) {
        table.increments('id').primary(); // Add a primary key column
        table.integer('streak_number').notNullable();
        table.text('message').notNullable();
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('positive_reinforcement_messages');
};