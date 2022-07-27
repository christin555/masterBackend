
exports.up = (knex) => knex.schema.alterTable('articles', (table) => {
    table.string('place')
        .comment('Локация');
    table.string('square')
        .comment('Площадь');
    table.string('articleType')
        .comment('Тип поста(видео, карусель...)');
    table.integer('watchCount')
        .comment('Колво просмотров');
    table.integer('mediaPosition');
});


exports.down = (knex) => knex.schema.alterTable('articles', (table) => {
    table.dropColumns('place');
    table.dropColumns('square');
    table.dropColumns('articleType');
    table.dropColumns('watchCount');
    table.dropColumns('mediaPosition');
});
