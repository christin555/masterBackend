module.exports = {
    getCategoryUnder: ({categoryIds, knex}) => {
        return knex
            .withRecursive('tmp', (qb) => {
                qb.select(['under', 'head'])
                    .from('hierarchy')
                    .whereIn('head', categoryIds)
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
    }
};