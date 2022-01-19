const {groupArray2Object} = require("../tools/array2Object");
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
                'categories.name as category',
                'brands.name as brand',
                'prices.price as price',
                'collections.name as collection',
                'finishingMaterial',
                'brands.name as brand',
                'products.chars as chars',
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
            .leftJoin('collections', 'collections.id', 'products.collectionId')
            .leftJoin('categories', 'categories.id', 'products.categoryId')
            .leftJoin('brands', 'brands.id', 'brandId')
            .where('products.alias', alias)
            .groupBy([
                'products.alias', 'products.id', 'products.name', 'categories.name',
                'collections.name', 'brands.name', 'prices.price'
            ]);

        //для дверей, так как пока нет иерархи ниже чем двери, то так)))
        //const catagories = await getNextLevelCategory({knex, categoryId: product.categoryId});
        if (product?.finishingMaterial && product.finishingMaterial.length) {
            const finishingMaterial = await knex('finishingMaterialDoors')
                .select()
                .whereIn('id', product.finishingMaterial);

            fields.push({
                name: 'finishingMaterial',
                values: groupArray2Object(finishingMaterial, 'type')
            });
        }

        return {
            values: product,
            fields
        };
    }
};
