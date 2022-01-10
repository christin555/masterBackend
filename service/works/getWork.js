const {getProducts} = require("../products/getProducts");
const {getServices} = require("../services/getServices");
const {entity: entityEnum} = require('../../enums');

module.exports = {
    getWork: async ({knex, body}) => {
        const {id} = body;
        const promises = [];

        const work = await knex('works')
            .first([
                'works.*',
                'prices.price',
                knex.raw('COALESCE(json_agg("worksRelations") FILTER (WHERE "worksRelations"."workId" IS NOT NULL), null) as relations')
            ])
            .leftJoin('prices', function () {
                this.on(function () {
                    this.on('prices.entityId', '=', 'works.id');
                    this.on('prices.entity', '=', entityEnum.WORK);
                });
            })
            .leftJoin('worksRelations', function () {
                this.on(function () {
                    this.on('worksRelations.workId', '=', 'works.id');
                });
            })
            .where('works.id', id)
            .groupBy(['works.id', 'prices.price']);

        if (work.relations?.length) {
            const services = work.relations.filter(({entity}) => entity === entityEnum.SERVICE);
            const products = work.relations.filter(({entity}) => entity === entityEnum.PRODUCT);
            console.log(products);

            if (services.length) {
                const body = {
                    ids: services.map(({entityId}) => entityId)
                };
                promises.push(getServices({knex, body}));
            } else {
                promises.push([]);
            }

            if (products.length) {
                console.log('hhh');
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

        promises.push(
            knex('media')
                .select()
                .where('media.entityId', '=', work.id)
                .where('media.entity', '=', entityEnum.WORK)
        );

        const [services, products, imgs] = await Promise.all(promises);
        console.log(imgs);
        work.services = services;
        work.products = products;
        work.imgs = imgs;

        delete work.relation;
        return work;
    }
};
