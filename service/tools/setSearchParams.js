const {getCategoryUnder} = require('../catalog/getCategoryUnder');

const filterFields = [
    'finishingMaterial',
    'collectionId',
    'isPopular',
    'price'
];

module.exports = {
    setSearchParams: async ({query, knex, filter = {}}) => {
        const {ids, categoryId, categoryIds, fastfilter} = filter;

        if (fastfilter) {
            const categoryIds = await knex('categories')
                .pluck('id')
                .whereRaw('name ~* ?', fastfilter);
            const categoryIdsLast = await getCategoryUnder({categoryIds, knex});

            query.where((builder) => {
                builder
                    .whereRaw('products.id::text = ?', fastfilter)
                    .orWhereRaw('products.name ~* ?', fastfilter)
                    .orWhereRaw('collections.name ~* ?', fastfilter)
                    .orWhereRaw('categories.name ~* ?', fastfilter)
                    .orWhereIn('products.categoryId', [...categoryIds, ...categoryIdsLast]);
            });
        }

        if (ids) {
            query.whereIn('products.id', ids);
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
                    if (key === 'price') {
                        setPrice(query, value);
                    } else if (Array.isArray(value) && value.length) {
                        if (key === 'finishingMaterial') {
                            query.where(key, '&&', value);
                        } else {
                            query.whereIn(key, value);
                        }
                    } else if (typeof value === 'boolean') {
                        query.where(key, value);
                    } else {
                        if (key === 'finishingMaterial') {
                            query.where(key, '&&', [value]);
                        } else {
                            query.where(key, value);
                        }
                    }
                }
            });
        }
    }
};

const setPrice = (query, value) => {
    if (value) {
        const _price = value.split('-');

        query
            .where('prices.price', '>=', _price[0])
            .where('prices.price', '<=', _price[1]);
    }
};
