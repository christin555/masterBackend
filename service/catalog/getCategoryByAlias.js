module.exports = {
    getCategoryByAlias: async ({alias, knex}) =>
        knex('categories')
            .first([
                'id',
                'name',
                'img',
                'level',
                'alias',
                'description',
                'isLast'
            ])
            .where('alias', alias)
};

