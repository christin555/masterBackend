const {getCategoryUnder} = require('../catalog/getCategoryUnder');

const filterFields = [
    'finishingMaterial',
    'collectionId'
];

module.exports = {
    setSearchParams: async({query, knex, searchParams}) => {
        const {categoryId, filter, categoryIds} = searchParams;
        const {search} = filter;

        if (search) {
            const categoryIds = await knex('categories')
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
            query.where('products.categoryId', categoryId);
        }

        if (categoryIds) {
            query.whereIn('products.categoryId', categoryIds);
        }

        if (filter) {
            Object.entries(filter).forEach(([key, value]) => {
                if (key && value && filterFields.includes(key)) {
                    if (Array.isArray(value) && value.length) {
                        if (key === 'finishingMaterial') {
                            query.where(key, '&&', value);
                        } else {
                            query.whereIn(key, value);
                        }
                    }
                }
            });
        }
    }
};
