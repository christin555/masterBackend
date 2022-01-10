const {entity} = require('../../enums');

module.exports = {
    getWorks: async ({knex, body}) => {
        const {limit, offset = 0} = body;

        const services = knex('works')
            .select([
                'works.*',
                'prices.price',
                'media.src as img'
            ])
            .leftJoin('prices', function () {
                this.on(function () {
                    this.on('prices.entityId', '=', 'works.id');
                    this.on('prices.entity', '=', entity.WORK);
                });
            })
            .leftJoin('media', function () {
                this.on(function () {
                    this.on('media.entityId', '=', 'works.id');
                    this.on('media.entity', '=', entity.WORK);
                    this.onIn('media.isMain', true);
                });
            })
            .offset(offset);

        if (limit) {
            services.limit(limit);
        }

        return services;
    }
};
