exports.up = (knex) => knex.schema.createTable('selections', table => {
    table.increments('id')
        .primary();
    table.string('alias')
        .notNullable();
    table.jsonb('filter')
        .notNullable();
    table.string('title');
    table.string('desc');
    table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('selections');
