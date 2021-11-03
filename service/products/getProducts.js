const {entity} = require('../../enums');
const {mapToList} = require('../tools/mapToList');
const {setSearchParams} = require('../tools/setSearchParams');

module.exports = {
    getProducts: async({knex, body}) => {
        const {searchParams, limit, offset} = body;
        console.log(searchParams);

        const query = knex('products')
            .select([
                'products.*',
                'brands.name as brand',
                'collections.name as collection',
                'brands.weight',
                'prices.price',
                knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as imgs')
            ])
            .leftJoin('media', function() {
                this.on(function() {
                    this.on('media.entityId', '=', 'products.id');
                    this.on('media.entity', '=', entity.PRODUCT);
                });
            })
            .leftJoin('collections', 'collections.id', 'collectionId')
            .leftJoin('brands', 'brands.id', 'brandId')
            .leftJoin('prices', function() {
                this.on(function() {
                    this.on('prices.entityId', '=', 'products.id');
                    this.on('prices.entity', '=', entity.PRODUCT);
                });
            })
            .whereNull('products.deleted_at')
            .whereNull('collections.deleted_at')
            .limit(limit)
            .offset(offset)
            .orderBy('weight')
            .groupBy([
                'products.id',
                'brands.name',
                'brands.weight',
                'collections.name',
                'prices.price'
            ]);

        await setSearchParams({query, knex, searchParams});

        const products = await query;

        if (!products.length) {
            return [];
        }

        return mapToList({products});
    }
};
