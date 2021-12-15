module.exports = {
    getNextLevelCategory: ({knex, categoryId}) => knex('categories')
        .select([
            'name',
            'img',
            'level',
            'alias',
            'categories.id'
        ])
        .join('hierarchy', 'hierarchy.under', 'categories.id')
        .where('hierarchy.head', categoryId)
};


