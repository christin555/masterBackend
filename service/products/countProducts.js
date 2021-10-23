const {setSearchParams} = require('../tools/setSearchParams');

module.exports = {
    countProducts: async({body, knex}) => {
        const {searchParams, searchParams: {category} = {}} = body;
        const query = knex('products')
            .count('products.id')
            .first();

        if (category) {
            query.join('categories', 'categories.id', 'products.categoryId')
                .where('categories.alias', category);
        }

        await setSearchParams({query, knex, searchParams});

        const {count} = await query;

        return count;
    }
};
