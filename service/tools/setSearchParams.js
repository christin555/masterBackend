const layoutFix = require("./layoutFix");
const {getCategoryUnder} = require('../catalog/getCategoryUnder');

const filterFields = [
    'finishingMaterial',
    'collectionId',
    'isPopular',
    'price',
    'isSale',
    'brandId'
];

module.exports = {
    setSearchParams: async ({query, knex, filter = {}}) => {
        const {ids, categoryId, categoryIds, fastfilter, selection} = filter;

        if (selection) {
            const [filterSelection] = await knex('selections')
                .pluck('filter')
                .where('alias', selection);

            Object.entries(filterSelection).forEach(([key, value]) => {
                setQueryField(key, value, query);
            });
        }

        if (fastfilter) {
            // query.select(knex.raw(`strict_word_similarity(?, "searchKeys") as sml`,fastfilter))
            //     .orderBy('sml');

            query.where((builder) => {
                const _fastfilter = getQuerySim(fastfilter);
                const _fastfilter_trans = getQuerySim(layoutFix(fastfilter));

                builder
                    .whereRaw('products.id::text = ?', fastfilter)
                    .orWhereRaw(`(${_fastfilter.string})/${_fastfilter.length} > 0.5`)
                    .orWhereRaw(`(${_fastfilter_trans.string})/${_fastfilter_trans.length} > 0.5`);
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
                    setQueryField(key, value, query);
                }
            });
        }
    }
};

const getQuerySim = (fastfilter) => {
    const arr_words = fastfilter
        .trim()
        .split(' ')
        .map((word) => `strict_word_similarity('${word}', "searchKeys")`);
    
    return {
        string: arr_words.join('+'),
        length: arr_words.length
    };
};

const setQueryField = (key, value, query) => {
    if (key === 'isSale') {
        setAction(query);
    } else if (key === 'price') {
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
};

const setAction = (query) => query.whereNotNull('prices.salePrice');

const setPrice = (query, value) => {
    if (value) {
        const _price = value.split('-');

        query
            .where('prices.price', '>=', _price[0])
            .where('prices.price', '<=', _price[1]);
    }
};
