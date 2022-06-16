const {posts} = require('../../enums');

module.exports = {
    getWorks: async ({knex, body}) => {
        const {limit, offset = 0} = body;

        const services = knex('articles')
            .select()
            .where('type', posts.WORKS)
            .offset(offset);

        if (limit) {
            services.limit(limit);
        }

        return services;
    }
};
