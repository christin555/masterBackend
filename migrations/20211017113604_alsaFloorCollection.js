const brand = {
    name: 'Alsafloor',
    alias: 'alsafloor'
};

const collections = (brandId) => {
    const data = [
        'Solid Medium',
        'Solid Plus',
        'Solid Chic',
        'Creative Baton Rompu/Herringbone',
        'Osmoze',
        'Osmoze Medium'
    ];

    return data.map(name => {
        return {
            name,
            brandId,
            nameDealer: `Alsafloor ${name}`,
        };
    });
};

exports.up = async(knex) => {
    const [brandId] = await knex('brands')
        .insert(brand)
        .returning('id');

    await knex('collections')
        .insert(collections(brandId));
};

exports.down = knex => {

};
