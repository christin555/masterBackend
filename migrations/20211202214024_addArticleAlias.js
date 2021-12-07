
exports.up = function(knex) {
    return Promise.all([
        knex.schema.alterTable('articles', (table) => {
            table.string('alias')
                .nullable()
                .comment('alias');
        })
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.alterTable('articles', (table) => {
            table.dropColumns(['alias']);
        })
    ]);
};
