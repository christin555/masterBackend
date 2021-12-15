const {entity} = require('../../enums');
const {mapToList} = require('../tools/mapToList');
const {setSearchParams} = require('../tools/setSearchParams');
const {Laminate} = require('../catalog/Filter/filters/floors');
const {createSearch} = require('./searchHandlers');

module.exports = {
    getProducts: async ({knex, body, category}) => {
        const {filter, limit, offset, order = {}} = body;
        const {direction, field} = order;

        const query = knex('products')
            .select([
                'products.*',
                'brands.name as brand',
                'categories.name as category',
                'collections.name as collection',
                'brands.weight',
                'prices.price',
                knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as imgs')
            ])
            .leftJoin('media', function () {
                this.on(function () {
                    this.on('media.entityId', '=', 'products.id');
                    this.on('media.entity', '=', entity.PRODUCT);
                });
            })
            .leftJoin('categories', 'categories.id', 'categoryId')
            .leftJoin('collections', 'collections.id', 'collectionId')
            .leftJoin('brands', 'brands.id', 'brandId')
            .leftJoin('prices', function () {
                this.on(function () {
                    this.on('prices.entityId', '=', 'products.id');
                    this.on('prices.entity', '=', entity.PRODUCT);
                });
            })
            .whereNull('products.deleted_at')
            .whereNull('collections.deleted_at')
            .limit(limit)
            .offset(offset)

            .groupBy([
                'products.id',
                'brands.name',
                'brands.weight',
                'collections.name',
                'prices.price',
                'categories.name'
            ]);

        if (direction && field) {
            query.orderByRaw(`"${field}" ${direction} NULLS LAST`);
        } else {
            query.orderBy('weight');
        }

        const searchInstance = createSearch(category, knex, filter);

        if (searchInstance) {
            await searchInstance.setFilterToQuery(query);
        }

        await setSearchParams({query, knex, filter});

        const products = await query;

        if (!products.length) {
            return [];
        }


        return mapToList({products});
    }
};
