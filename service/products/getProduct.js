const {entity} = require('../../enums');

module.exports = {
    getProduct: async({params, knex}) => {
        const {alias} = params;

        const fields = await knex('catalogItems')
            .pluck('item')
            .join('catalogs', 'catalogs.id', 'catalogItems.catalogId')
            .where('name', 'quartzvinylCardFields');

        const fieldsName = fields.map(({name}) => name);

        const product = await knex('products')
            .first([
                'products.id',
                'products.alias',
                'products.name',
                'products.description',
                'products.categoryId',
                'prices.price as price',
                'collectionName',
                'finishingMaterial',
                'brands.name as brand',
                knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as imgs'),
                ...fieldsName
            ])
            .leftJoin('prices', function() {
                this.on(function() {
                    this.on('prices.entityId', '=', 'products.id');
                    this.on('prices.entity', '=', entity.PRODUCT);
                });
            })
            .leftJoin('media', function() {
                this.on(function() {
                    this.on('media.entityId', '=', 'products.id');
                    this.on('media.entity', '=', entity.PRODUCT);
                });
            })
            .leftJoin('collections', 'collections.id', 'collectionId')
            .leftJoin('brands', 'brands.id', 'brandId')
            .where('products.alias', alias)
            .groupBy(['products.alias', 'products.id', 'products.name', 'collections.name', 'brands.name', 'prices.price']);

        //для дверей, так как пока нет иерархи ниже чем двери, то так)))
        //const catagories = await getNextLevelCategory({knex, categoryId: product.categoryId});
        if (product?.finishingMaterial && product.finishingMaterial.length) {
            const finishingMaterial = await knex('finishingMaterialDoors')
                .select()
                .whereIn('id', product.finishingMaterial);
            fields.push({name: 'finishingMaterial', values: finishingMaterial});
        }

        return {
            values: product,
            fields
        };
    }
};
