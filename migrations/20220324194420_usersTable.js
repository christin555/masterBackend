
exports.up = (knex) => knex.schema.createTable("users", table => {
    table.increments("id")
        .primary();
    table.string("email")
        .notNullable()
        .unique();
    table.string("name");
    table.string("password")
        .notNullable();
    table.timestamp("deleted_at");
    table.timestamps();
});

exports.down = (knex) => knex.schema.dropTable('users');
