exports.up = (knex) => {
    return Promise.all([
        knex.schema.alterTable('products', (table) => {
            table.string('glossLevel')
                .comment('Степень блеска лака');

            table.string('basisWeight')
                .comment('Вес');

            table.string('wearThickness')
                .comment('Толщина рабочего слоя');
        })
    ]);
};

exports.down = (knex) => {
    return knex.schema.alterTable('products', (table) => {
        table.dropColumns([
            'glossLevel',
            'basisWeight',
            'wearThickness'
        ]);
    });
};
