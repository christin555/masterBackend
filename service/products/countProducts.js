const {setSearchParams} = require('../tools/setSearchParams');
const {getCategoryByAlias} = require("../catalog/getCategoryByAlias");
const {getCategoryUnder} = require("../catalog/getCategoryUnder");

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

        await setSearchParams({query, knex, searchParams});

        console.log(query.toQuery());

        const {count} = await query;

        return count;
    }
};
