exports.up = function(knex) {
    return knex.schema.table('users', function(table) {
      table.string('location').nullable();
    });
  };
  
exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
        table.dropColumn('location');
    });
};
