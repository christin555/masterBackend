const {entity} = require('../../enums');

module.exports = {
    getServices: async ({knex, body}) => {
        const {limit, offset = 0, ids} = body;

        const services = knex('services')
            .select([
                'services.*',
                'prices.price'
            ])
            .leftJoin('prices', function () {
                this.on(function () {
                    this.on('prices.entityId', '=', 'services.id');
                    this.on('prices.entity', '=', entity.SERVICE);
                });
            })
            .offset(offset);

        if (limit) {
            services.limit(limit);
        }

        if (ids) {
            services.whereIn('services.id', ids);
        }

        return services;
    }
};
