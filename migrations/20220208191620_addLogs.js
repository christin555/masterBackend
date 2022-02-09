
exports.up = (knex) => knex.schema.createTable('logs', table => {
    table.increments('id')
        .primary();
    table.string('action')
        .notNullable();
    table.text('data')
        .notNullable();
    table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('logs')
