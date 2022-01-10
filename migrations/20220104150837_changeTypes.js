exports.up = function (knex) {
    return knex.schema.alterTable('worksRelations', (table) => {
        table.integer('entityId').alter();
        table.integer('entity').alter();
    });
};

exports.down = function (knex) {

};
