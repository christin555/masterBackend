const {entity} = require('../../enums');
const {mapToList} = require('../tools/mapToList');
const {setSearchParams} = require('../tools/setSearchParams');

module.exports = {
    getProducts: async ({knex, body}) => {
        const {searchParams, limit, offset} = body;
        const prices = [];

        const query = knex("products")
            .select(['products.*',
                knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as imgs')])
            .leftJoin('media', function() {
                this.on(function () {
                    this.on('media.entityId', '=', 'products.id');
                    this.on('media.entity', '=', entity.PRODUCT);
                });
            })
            // .leftJoin('categories','categories.id', 'categoryId')
            .limit(limit)
            .offset(offset * limit)
            .groupBy('products.id');
        
        await setSearchParams({query, knex, searchParams});

        console.log(query .toQuery());
        const products = await query;
        
        if (!products.length) {
            return [];
        }

        return mapToList({products, prices});
    }
};
