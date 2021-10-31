const {entity} = require('../../enums');
const {mapToList} = require('../tools/mapToList');
const {setSearchParams} = require('../tools/setSearchParams');
const {Laminate} = require('../catalog/Filter/filters/laminate');
const {createSearch} = require('./searchHandlers');

const filtersHandlers = {
    laminate: Laminate
};

module.exports = {
    getProducts: async({knex, body, category}) => {
        const {searchParams, limit, offset} = body;
        const prices = [];

        const query = knex('products')
            .select([
                'products.*',
                'brands.name as brand',
                'brands.weight',
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
            .whereNull('products.deleted_at')
            .whereNull('collections.deleted_at')
            .limit(limit)
            .offset(offset)
            .orderBy('weight')
            .groupBy(['products.id', 'brands.name', 'brands.weight']);

        const searchInstance = createSearch(category, knex, searchParams.filter);

        if (searchInstance) {
            await searchInstance.setFilterToQuery(query);
        } else {
            await setSearchParams({query, knex, searchParams});
        }

        console.log(query.toQuery());

        const products = await query;

        if (!products.length) {
            return [];
        }

        return mapToList({products, prices});
    }
};
