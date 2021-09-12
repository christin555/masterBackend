module.exports = {
    getCategories: async ({knex}) => {
        const сategories = await knex('categories')
            .select(['id', 'alias'])
       //    .whereIn('alias', ['quartzvinyl_kleevay', 'quartzvinyl_zamkovay']);

        return сategories;
    }
};
