const {entity} = require('../../enums');

module.exports = {
    getArticles: async({knex}) => {
        return knex('articles')
            .select()
            .leftJoin('media', function() {
                this.on(function() {
                    this.on('media.entityId', '=', 'articles.id');
                    this.on('media.entity', '=', entity.ARTICLE);
                });
            });
    }
};
