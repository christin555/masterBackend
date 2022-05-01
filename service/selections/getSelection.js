module.exports = {
    getSelection: async ({body: {alias}, knex}) =>
        knex('selections')
            .first(['title', 'desc', 'alias'])
            .where('alias', alias)
};

