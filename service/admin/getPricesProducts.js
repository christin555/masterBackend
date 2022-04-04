const {entity} = require('../../enums');
const {mapToList} = require('../tools/mapToList');
const {setSearchParams} = require('../tools/setSearchParams');


module.exports = {
    getPricesProducts: async ({body, knex}) => {
        const {categoryId, fastfilter} = body;

        const filter = {
            fastfilter: fastfilter?.trim() || null,
            categoryId
        };
        
        const query = knex('products')
            .select([
                'products.*',
                'brands.name as brand',
                'categories.name as category',
                'collections.name as collection',
                'prices.price'
            ])
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
            .groupBy([
                'products.id',
                'brands.name',
                'collections.name',
                'prices.price',
                'categories.name'
            ])
            .orderBy(['brand', 'collection', 'name']);
        
        
        await setSearchParams({query, knex, filter});

        const products = await query;


        if (!products.length) {
            return [];
        }


        return mapToList({products});
    }
};

