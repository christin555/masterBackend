const {getProducts} = require('../products/getProducts');


module.exports = {
    getPopular: async ({body, knex}) => {
        const {category} = body;
        const filter = {
            isPopular: true
        };
        return getProducts({knex, body: {filter, limit: 15}});
    }
};
