exports.up = function(knex) {
    return knex.schema.table('users', function(table) {
      table.integer('current_streak').defaultTo(0);
    });
  };
  
exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
        table.dropColumn('current_streak');
    });
};