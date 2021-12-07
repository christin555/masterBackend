exports.up = knex => {
    const fix = knex.schema.alterTable('products', (table) => {
        table.renameColumn('collection', 'collectionName');
        table.renameColumn('length', 'materialLength');
        table.renameColumn('format', 'materialFormat');
    });

    const addIdToTable = (t) => {
        return knex.schema.alterTable(t, (table) => {
            table.increments('id');
        });
    };

    return Promise.all([
        fix,
        addIdToTable('prices'),
        addIdToTable('catalogItemsCategory'),
        addIdToTable('hierarchy'),
        addIdToTable('media')
    ]);
};

exports.down = knex => {

};
