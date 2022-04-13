const {entity} = require('../../enums');

module.exports = {
    updatePrices: async ({body, knex}) => {
        const {products} = body;

        const data = products.map(({id, newPrice, salePercent, salePrice}) => {
            return {
                entity: entity.PRODUCT,
                entityId: id,
                price: newPrice,
                salePercent,
                salePrice
            };
        });
        

        await knex('logs')
            .insert(
                products.map((product) => {
                    return {
                        action: 'changePrice',
                        data: JSON.stringify(product),
                        created_at: new Date()
                    };
                }
                ));
            
        return knex('prices')
            .insert(data)
            .onConflict(['entity','entityId'])
            .merge();

    }
};
