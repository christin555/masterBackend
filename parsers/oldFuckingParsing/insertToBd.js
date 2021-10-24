const {entity} = require('../../enums');
const {imagesWorker} = require("./imagesWorker");

module.exports = {
    insertToBd: async (knex, {readyToInsert, imgs}, prices) => {
        const products = await knex('products')
            .insert(readyToInsert)
            .onConflict(['name', 'categoryId', 'collectionId', 'code'])
            .merge()
            .returning(['id', 'name', 'code']);


        await imagesWorker({products, knex, imgs});
        if (prices) {
            const pricesProducts = products.map(({id, code}) => {
                return {
                    entity: entity.PRODUCT,
                    entityId: id,
                    price: prices[code]
                };
            });

            await knex('prices')
                .insert(pricesProducts);
        }
        //  .onConflict(['name', 'categoryId'])
        //   .merge();
    }
};
