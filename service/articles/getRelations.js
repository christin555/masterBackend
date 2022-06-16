const {getProducts} = require("../products/getProducts");
const {getServices} = require("../services/getServices");
const {entity: entityEnum} = require('../../enums');

module.exports = {
    getRelations: async ({knex, id}) => {
        const promises = [];

        const rels = await knex('articlesRelations')
            .select()
            .where('articleId', id);

        if (rels?.length) {
            const services = rels.filter(({entity}) => entity === entityEnum.SERVICE);
            const products = rels.filter(({entity}) => entity === entityEnum.PRODUCT);

            if (services.length) {
                const body = {
                    ids: services.map(({entityId}) => entityId)
                };
                promises.push(getServices({knex, body}));
            } else {
                promises.push([]);
            }

            if (products.length) {
                const body = {
                    filter: {
                        ids: products.map(({entityId}) => entityId)
                    }
                };
                promises.push(getProducts({knex, body}));
            } else {
                promises.push([]);
            }
        } else {
            promises.push([], []);
        }


        const [services, products] = await Promise.all(promises);

        return {services, products};
    }
};
