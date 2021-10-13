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

    return knex('products')
        .update('deleted_at', knex.fn.now())
        .whereIn('collectionId', ids);

};

exports.down = () => {

};
