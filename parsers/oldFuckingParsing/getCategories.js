module.exports = {
    getCategories: ({knex}) => knex('categories').select(['id', 'alias'])
};
