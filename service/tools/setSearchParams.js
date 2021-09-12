const {getCategoryUnder} = require('../catalog/getCategoryUnder');
module.exports = {
    setSearchParams: async ({query, knex, searchParams}) => {
        const {search, categoryId, filter} = searchParams;

        if (search) {
            const categoryIds = await knex("categories")
                .pluck('id')
                .whereRaw('name ~* ?', search);
            const categoryIdsLast = await getCategoryUnder({categoryIds, knex});

            query.where((builder) => {
                builder
                    .whereRaw('products.id::text = ?', search)
                    .orWhereRaw('products.name ~* ?', search)
                    .orWhereRaw('products.collection ~* ?', search)
                    .orWhereIn('products.categoryId', [...categoryIds, ...categoryIdsLast]);
            });
        }

        if (categoryId) {
            query.where('categoryId', categoryId);
        }

        console.log(filter);

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (key && value) {
                    if(Array.isArray(value) && value.length)
                    {
                        if (key === 'finishingMaterial') {
                            query.where(key, '&&', value);
                        }
                        else {
                            query.whereIn(key, value);
                        } 
                    }
                }
            });
        }
    }
};
