const {entity} = require("../../enums");

const getProducts = async (knex, fields = []) => knex('products')
    .select([
        'products.id',
        'products.alias',
        'products.description',
        'products.name',
        'prices.price',
        'categories.alias as category',
        'collections.name as collection',
        'categories.name as categoryname',
        'brands.name as brand',
        knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as imgs'),
        ...fields
    ])
    .leftJoin('categories', 'categories.id', 'categoryId')
    .leftJoin('collections', 'collections.id', 'collectionId')
    .leftJoin('brands', 'brands.id', 'brandId')
    .join('prices', function () {
        this.on(function () {
            this.on('prices.entityId', '=', 'products.id');
            this.on('prices.entity', '=', entity.PRODUCT);
        });
    })
    .join('media', function () {
        this.on(function () {
            this.on('media.entityId', '=', 'products.id');
            this.on('media.entity', '=', entity.PRODUCT);
        });
    })
    .whereNull('products.deleted_at')
    .whereNull('collections.deleted_at')
    .groupBy(['products.id', 'products.alias', 'categories.alias', 'collections.name', 'categories.name', 'brands.name', 'prices.price']);


module.exports = {
    getProducts
};
