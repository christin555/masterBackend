const {entity} = require('../../enums');
const {mapToList} = require('../tools/mapToList');
const {setSearchParams} = require('../tools/setSearchParams');

module.exports = {
    getProducts: async ({knex, body}) => {
        const {searchParams, limit, offset} = body;
        const prices = [];

        const query = knex("products")
            .select([
                'products.*',
                'brands.name as brand',
                knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as imgs')
            ])
            .leftJoin('media', function() {
                this.on(function () {
                    this.on('media.entityId', '=', 'products.id');
                    this.on('media.entity', '=', entity.PRODUCT);
                });
            })
            .leftJoin('collections','collections.id', 'collectionId')
            .leftJoin('brands','brands.id', 'brandId')
            .whereNull('deleted_at')
            .limit(limit)
            .offset(offset * limit)
            .groupBy(['products.id', 'brands.name']);
        
        await setSearchParams({query, knex, searchParams});

        const products = await query;
        
        if (!products.length) {
            return [];
        }

        return mapToList({products, prices});
    }
};
