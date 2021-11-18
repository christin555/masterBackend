
exports.up = function(knex) {
    return knex.schema.alterTable('products', (table) => {
        table.boolean('isPopular');
        table.boolean('isBestPrice');
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('products', (table) => {
        table.dropColumns([
            'isPopular',
            'isBestPrice'
        ]);
    });
};
