module.exports = {
    getCategories: async ({knex}) =>
        knex('categories')
            .select([
                'id',
                'name',
                'alias'
            ])
            .where('isLast', true)
};

