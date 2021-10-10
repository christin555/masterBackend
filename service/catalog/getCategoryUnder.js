const {entity} = require('../../enums');
const {mapToList} = require('../tools/mapToList');

module.exports = {
    getCategoryUnder: async ({categoryIds, knex}) => {
        const categoryUnder = knex
            .withRecursive('tmp', (qb) => {
                qb.select(['under', 'head'])
                    .from('hierarchy')
                    .whereIn('under',categoryIds)
                    .unionAll((sqb) => {
                        sqb
                            .select(['hierarchy.under', 'hierarchy.head'])
                            .from('tmp')
                            .join('hierarchy', 'hierarchy.head', 'tmp.under');
                    });
            })
            .from('tmp')
            .pluck('id')
            .join('categories', 'categories.id', 'tmp.under')
            .whereNull('categories.deleted_at')
            .andWhere('isLast', true);

        return categoryUnder;
    }
};

getEntities = (products, categories) => {
    const entities = [];

    products.forEach(({id}) => {
        entities.push([
            entity.PRODUCT,
            id
        ]);
    });
    categories.forEach(({id}) => {
        entities.push([
            entity.CATEGORY,
            id
        ]);
    });
    return entities;
};
