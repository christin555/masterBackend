const collectionsForHide = [
    'France',
    'Germany',
    'Первая Сибирская',
    'Первая Уральская',
    'Fiesta',
    'Holiday'
];
exports.up = async(knex) => {

    const ids = await knex('collections')
        .pluck('id')
        .whereIn('name', collectionsForHide);

    return Promise.all([
        knex('products')
            .update('deleted_at', knex.fn.now())
            .whereIn('collectionId', ids),
        knex('collections')
            .update('deleted_at', knex.fn.now())
            .whereIn('name', collectionsForHide)
    ]);

};

exports.down = () => {

};
