const collections = (brandId, coll) => {
    return coll.map(name => {
        return {
            name,
            brandId,
            nameDealer: name
        };
    });
};

exports.addCollection = async function (knex, brand, coll) {
    const [brandId] = await knex('brands')
        .insert(brand)
        .returning('id')
        .onConflict(['name'])
        .merge();

    await knex('collections')
        .insert(collections(brandId, coll))
        .onConflict(['name', 'brandId'])
        .merge();
};


