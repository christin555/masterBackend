const {getProducts} = require('../products/getProducts');

module.exports = {
    getPricesProducts: async ({body, knex}) => {
        const {categoryId, fastfilter} = body;

        return getProducts({
            knex, body: {
                filter: {
                    fastfilter: fastfilter?.trim() || null,
                    categoryId
                }
            }
        });
    }
};
