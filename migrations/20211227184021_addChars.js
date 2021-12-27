exports.up = (knex) => knex.schema.alterTable('products', (table) => {
    table.text('chars')
        .comment('Доп свойства');

});

exports.down = (knex) => knex.schema.alterTable('products', (table) => {
    table.dropColumns(['chars']);
});
