const {setSearchParams} = require('../tools/setSearchParams');
const {getCategoryByAlias} = require("../catalog/getCategoryByAlias");
const {getCategoryUnder} = require("../catalog/getCategoryUnder");
const {createSearch} = require('./searchHandlers');

module.exports = {
    countProducts: async({body, knex}) => {
        const {searchParams, searchParams: {category} = {}} = body;
        const query = knex('products')
            .count('products.id')
            .first()
            .leftJoin('collections', 'collections.id', 'collectionId')
            .whereNull('products.deleted_at')
            .whereNull('collections.deleted_at');

        if (category) {
            const {id: categoryId, isLast} = await getCategoryByAlias({knex,alias: category});

            if (isLast) {
                query.where('products.categoryId', categoryId);
            }
            else {
                const categoryIds = await getCategoryUnder({categoryIds: [categoryId], knex});

                query.whereIn('products.categoryId', categoryIds);
            }
        }

        const searchInstance = createSearch(category, knex, searchParams.filter);

        if (searchInstance) {
            await searchInstance.setFilterToQuery(query);
        } else {
            await setSearchParams({query, knex, searchParams});
        }

        const {count} = await query;

        return count;
    }
};
