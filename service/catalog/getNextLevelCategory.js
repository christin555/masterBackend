module.exports = {
    getNextLevelCategory: async ({knex, categoryId}) =>
        knex("categories")
            .select([
                'name',
                'img',
                'level',
                'alias'
            ])
            .join('hierarchy', 'hierarchy.under', 'categories.id')
            .where('hierarchy.head', categoryId)
};


