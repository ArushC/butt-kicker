exports.up = function(knex) {
    return knex.schema.table('users', function(table) {
      table.unique('username'); // Add unique constraint to the 'username' column
    });
};
  
exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
      table.dropUnique('username'); // Remove unique constraint from the 'username' column
    });
};