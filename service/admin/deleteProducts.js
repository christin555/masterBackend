const {entity} = require('../../enums');

module.exports = {
    deleteProducts: async ({body, knex}) => {
        const {ids} = body;
        

        await knex('logs')
            .insert({
                action: 'deleteProducts',
                data: JSON.stringify({ids}),
                created_at: new Date()
            });

        return knex('products')
            .update({deleted_at: new Date()})
            .whereIn('id', ids);
    }
};
