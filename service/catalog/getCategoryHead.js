const {entity} = require('../../enums');
const {mapToList} = require('../tools/mapToList');

module.exports = {
    getСategoryHead: async ({categoryId, knex}) => {
        const categoryHead = await knex
            .withRecursive('tmp', (qb) => {
                qb.select(['under', 'head'])
                    .from('hierarchy')
                    .where('under',categoryId)
                    .unionAll((sqb) => {
                        sqb
                            .select(['hierarchy.under', 'hierarchy.head'])
                            .from('tmp')
                            .join('hierarchy', 'hierarchy.under', 'tmp.head');
                    });
            })
            .from('tmp')
            .select()
            .join('categories', 'categories.id', 'tmp.head')
            .whereNull('categories.deleted_at');


        return categoryHead;
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
