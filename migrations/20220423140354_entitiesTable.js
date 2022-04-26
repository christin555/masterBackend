exports.up = (knex) => knex.schema.createTable('categoryRelations', table => {
    table.increments('id')
        .primary();
    table.integer('entity')
        .notNullable();
    table.integer('entityId')
        .notNullable();
    table.integer('categoryId')
        .notNullable();
    table.timestamps();
});


exports.down = (knex) => knex.schema.dropTable('categoryRelations');
