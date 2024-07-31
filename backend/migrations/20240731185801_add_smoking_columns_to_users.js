exports.up = function(knex) {
    return knex.schema.table('users', function(table) {
      table.boolean('smoke_free_yesterday').defaultTo(false);
      table.boolean('smoke_free_today').defaultTo(false);
      table.integer('saved_streak').defaultTo(0);
      table.date('last_checkin_date');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('users', function(table) {
      table.dropColumn('smoke_free_yesterday');
      table.dropColumn('smoke_free_today');
      table.dropColumn('saved_streak');
      table.dropColumn('last_checkin_date');
    });
  };