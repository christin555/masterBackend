const {setSearchParams} = require('../tools/setSearchParams');

module.exports = {
    countProducts: async ({body, knex}) => {
        const {searchParams, searchParams: {category} = {}} = body;
        console.log(category);
        const query = knex("products")
            .count('products.id')
            .first();
            console.log('countProducts', category);
        if (category) {
            query.
                join('categories', 'categories.id', 'products.categoryId')
                .where('categories.alias', category);
                console.log('ff');
        }

        await setSearchParams({query, knex, searchParams});

        const {count} = await query;

        return count;
    }
};
