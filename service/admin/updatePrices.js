const {entity} = require('../../enums');

module.exports = {
    updatePrices: async ({body, knex}) => {
        const {products} = body;

        const data = products.map(({id, newPrice}) => {
            return {
                entity: entity.PRODUCT,
                entityId: id,
                price: newPrice
            };
        });
        

        await knex('logs')
            .insert({
                action: 'changePrice',
                data: JSON.stringify(products),
                created_at: new Date()
            });

        return knex('prices')
            .insert(data)
            .onConflict(['entity','entityId'])
            .merge();
        
    }
};
