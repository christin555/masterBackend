const {entity} = require('../../enums');

module.exports = {
    getArticles: async ({body, knex}) => {
        const {searchParams, searchParams: {category} = {}} = body;
        const articles = await knex("articles")
            .select()
            .leftJoin('media', function () {
                this.on(function () {
                    this.on('media.entityId', '=', 'articles.id');
                    this.on('media.entity', '=', entity.ARTICLE);
                });
            })
  
        return articles;
    }
};
