exports.up = function (knex) {
    return Promise.all([
        knex.schema.alterTable('articles', (table) => {
            table.boolean('isPopular')
                .nullable();
            table.text('imgPreview')
                .nullable();
        })
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.alterTable('articles', (table) => {
            table.dropColumns(['isPopular', 'imgPreview']);
        })
    ]);
};
