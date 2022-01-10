const {entity} = require('../../enums');

module.exports = {
    getArticles: async ({body, knex}) => {
        const {limit, isPopular} = body;

        const query = knex('articles')
            .select()
            .leftJoin('media', function () {
                this.on(function () {
                    this.on('media.entityId', '=', 'articles.id');
                    this.on('media.entity', '=', entity.ARTICLE);
                });
            });

        if (limit) {
            query.limit(limit);
        }

        if (isPopular) {
            query.where('isPopular', isPopular);
        }
        return query;
    }
};
