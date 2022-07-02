const {entity} = require('../../enums');

module.exports = {
    updatePrices: async ({body, knex}) => {
        const {products} = body;

        const data = products.map(({id, newPrice, salePrice}) => {
            const item = {
                entity: entity.PRODUCT,
                entityId: id
            };

            newPrice && (item.price = Number(newPrice) || 0);
            salePrice && (item.salePrice = Number(salePrice));
            
            return item;
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

        //todo: хуй пойми как но исправить апдейт
        return knex('prices')
            .insert(data)
            .onConflict(['entity','entityId'])
            .merge();

    }
};
