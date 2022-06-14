exports.up = async (knex) => {
    await knex.schema.alterTable('products', (table) => {
        table.text('searchKeys')
            .comment('Поисковые фразы');
    });

    const rows = await knex('products')
        .select([
            knex.raw(`CONCAT_WS(' ',products.name, categories.name, brands.name, collections.name) as "searchKeys"`),
            'products.id'
        ])
        .leftJoin('categories', 'categories.id', 'products.categoryId')
        .leftJoin('collections', 'collections.id', 'products.collectionId')
        .leftJoin('brands', 'brands.id', 'collections.brandId');

    const promises = rows.map(({searchKeys, id}) => knex('products').update({searchKeys}).where('id', id));

    return Promise.all(promises);
};

exports.down = (knex) => knex.schema.alterTable('products', (table) => {
    table.dropColumns('searchKeys');
});
