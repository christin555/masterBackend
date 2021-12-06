const {entity} = require('../../enums');

module.exports = {
    getArticle: async({params, knex}) => {
        const {alias} = params;

        return knex('articles')
            .first([
                '*',
                'articles.type as category'
            ])
            .where('alias', alias)
            .leftJoin('media', function() {
                this.on(function() {
                    this.on('media.entityId', '=', 'articles.id');
                    this.on('media.entity', '=', entity.ARTICLE);
                });
            });
    }
};
