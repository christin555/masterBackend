
exports.up = (knex) => knex.schema.alterTable('prices', (table) => {
    table.string('salePrice')
        .comment('Цена со скидкой');
    table.string('salePercent')
        .comment('Процент скидки');
});


exports.down = (knex) => knex.schema.alterTable('prices', (table) => {
    table.dropColumns('salePrice');
    table.dropColumns('salePercent');
});
