module.exports = {
    getFirstLevels: ({knex}) =>
        knex('categories').select([
            'name',
            'img',
            'level',
            'alias'
        ]).where('level', 1)
};


