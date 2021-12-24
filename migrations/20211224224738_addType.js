
exports.up = (knex) => knex.schema.alterTable('products', (table) => {
    table.string('type')
        .comment('Тип');

    table.string('length')
        .comment('Длина');

    table.string('depth')
        .comment('Глубина');
});

exports.down = (knex) => knex.schema.alterTable('products', (table) => {
    table.dropColumns(['type', 'length', 'depth']);
});
