const {entity} = require('../../enums');
const {mapToList} = require('../tools/mapToList');
const {setSearchParams} = require('../tools/setSearchParams');
const {createSearch} = require('./searchHandlers');

module.exports = {
    getProducts: async ({knex, body, category}) => {
        await knex.raw(`SET pg_trgm.strict_word_similarity_threshold = 0.3;`);

        const {filter, limit, offset, order = {}} = body;
        const {direction, field} = order;

        const colNames = [
            'products.id',
            'brands.name',
            'brands.weight',
            'collections.name',
            'prices.price',
            'prices.salePrice',
            'prices.salePercent',
            'categories.name'
        ];

        if(filter.fastfilter){
            colNames.push('searchKeys');
        }

        const query = knex('products')
            .select([
                'products.name',
                'products.alias',
                'products.isBestPrice',
                'products.isPopular',
                'products.finishingMaterial',
                'brands.name as brand',
                'categories.name as category',
                'collections.name as collection',
                'brands.weight',
                'prices.price',
                'prices.salePrice',
                'prices.salePercent',
                knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as imgs')
            ])
            .leftJoin('media', function () {
                this.on(function () {
                    this.on('media.entityId', '=', 'products.id');
                    this.on('media.entity', '=', entity.PRODUCT);
                    this.onNull('media.deletedAt');
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
            .groupBy(colNames);

        if (direction && field) {
            query.orderByRaw(`"${field}" ${direction} NULLS LAST`);
        } else {
            query.orderBy('brands.weight');
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
