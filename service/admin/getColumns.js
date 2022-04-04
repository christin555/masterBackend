module.exports = {
    getColumns: async ({knex}) => {
        return knex('catalogItems')
            .pluck('item')
            .leftJoin('catalogs', 'catalogs.id', 'catalogId')
            .where('catalogs.name', 'quartzvinylCardFields');
    }
};
