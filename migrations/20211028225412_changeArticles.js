
exports.up = function(knex) {
    return Promise.all([
        knex.schema.alterTable('articles', (table) => {
            table.integer('type')
                .comment('Тип статьи')
                .defaultTo(1);

            table.timestamp('createdAt')
                .defaultTo(knex.fn.now())
                .comment('Дата создания');

            table.timestamp('deletedAt')
                .nullable()
                .comment('Дата удаления');

            table.string('showOnMainPage')
                .nullable()
                .comment('Показывать на главной странице');
        })
    ]);
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.alterTable('articles', (table) => {
            table.dropColumns([
                'type',
                'createdAt',
                'deletedAt',
                'showOnMainPage'
            ]);
        })
    ]);
};
