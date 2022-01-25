
exports.up = function(knex) {
    return knex.schema.createTable('seoTags', table => {
        table.string('asPath').unique();
        table.string('pathname');
        table.string('param');
        table.string('title');
        table.string('desc');
        table.string('keywords');
    });
};

exports.down = (knex) => knex.schema.dropTable('seoTags');

