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
                'isLast',
                'seo_title',
                'seo_desc',
            ])
            .where('alias', alias)
};

