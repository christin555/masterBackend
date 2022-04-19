const {entity} = require('../../enums');

module.exports = {
    getArticle: async({body, knex}) => {
        const {alias} = body;

        await knex('articles')
            .update({'watchCount': knex.raw('"watchCount" + 1')})
            .where('alias', alias);
        
        return knex('articles')
            .first([
                'articles.*',
                'articles.type as category',
                knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as media'),
            ])
            .where('alias', alias)
            .leftJoin('media', function() {
                this.on(function() {
                    this.on('media.entityId', '=', 'articles.id');
                    this.on('media.entity', '=', entity.ARTICLE);
                    this.onNull('media.deletedAt');
                });
            })
            .groupBy(['articles.id']);

    }
};
