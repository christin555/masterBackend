const collections = (brandId) => {
    const data = [
        'LOUNGE',
        'BLUES',
        'LOUNGE DIGI EDITION',
        'PROGRESSIVE HOUSE',
        'COSMIC',
        'DEEP HOUSE'
    ];

    return data.map(name => {
        return {
            name,
            brandId,
            nameDealer: name,
        };
    });
};

exports.up = async(knex) => {
    const {id} = await knex('brands')
        .first()
        .where('alias', 'tarkett');

    await knex('collections')
        .insert(collections(id));
};

exports.down = knex => {

};
