const {entity} = require('../../enums');

module.exports = {
    getArticles: async ({body, knex}) => {
        const {limit, isPopular} = body;

        const query = knex('articles').select();

        if (limit) {
            query.limit(limit);
        }

        if (isPopular) {
            query.where('isPopular', isPopular);
        }

        return query;
    }
};
