const collections = (brandId, categoryId) => {
    const data = [
        'SALSA',
        'SALSA ART',
        'TANGO',
        'TANGO ART',
        'TANGO CLASSIC',
        'STEP XL & L',
        'EUROPARQUET',
        'SALSA PREMIUM'
    ];

    return data.map(name => {
        return {
            name,
            brandId,
            nameDealer: name,
            categoryId
        };
    });
};

const category = {
    name: 'Паркет',
    level: 2,
    alias: 'parquet',
    isLast: true,
    img: 'https://www.tarkett.ru/media/img/large/IN_TEE_Salsa_premium.jpg'
};

exports.up = async(knex) => {
    const [[parquetId], {id: floorId}, {id} ] = await Promise.all([
        knex('categories')
            .insert(category)
            .onConflict(['alias'])
            .merge()
            .returning('id'),
        knex('categories')
            .first()
            .where('alias', 'floors'),
        knex('brands')
            .first()
            .where('alias', 'tarkett')
    ]);
    
    return Promise.all([
        knex('collections')
            .insert(collections(id, parquetId.id))
            .onConflict(['name', 'brandId'])
            .merge(), 
        knex('hierarchy')
            .insert({head: floorId, under:  parquetId.id})
    ]);
};

exports.down = knex => {

};
