const {entity} = require('../../enums');

module.exports = {
    getArticles: async ({body, knex}) => {
        const {limit, isPopular, category} = body;

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
        console.log(query.toQuery());
        return query;
    }
};
