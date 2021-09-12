module.exports = {
    getFirstLevels: async ({knex}) =>
        knex("categories").select([
            'name',
            'img',
            'level',
            'alias'
        ]).where('level', 1)
};


