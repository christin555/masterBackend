const {entity} = require('../../enums');

module.exports = {
    getArticles: async ({body, knex}) => {
        const {limit, isPopular, category, withMedia} = body;

        const query = knex('articles').select('articles.*');

        if (limit) {
            query.limit(limit);
        }


        if (category) {
            query
                .join('categoryRelations', function () {
                    this.on(function () {
                        this.on('entityId', '=', 'articles.id');
                        this.on('entity', '=', entity.ARTICLE);
                    });
                })
                .join('categories', function () {
                    this.on(function () {
                        this.on(knex.raw('categories.alias = ?', [category]));
                        this.on('categoryId', '=', 'categories.id');
                    });
                });
        }

        if (isPopular) {
            query.where('isPopular', isPopular);
        }

        if (withMedia) {
            query.select(knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as media'));
            query.leftJoin('media', function () {
                this.on(function () {
                    this.on('media.entityId', '=', 'articles.id');
                    this.on('media.entity', '=', entity.ARTICLE);
                    this.onNull('media.deletedAt');
                });
            })
                .groupBy(['articles.id']);
        }

        return query;
    }
};
