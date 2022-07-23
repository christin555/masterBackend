const knex = require('../knex');
const excel = require('excel4node');
const {entity} = require("../enums");

const columns = [
    ['alias', 'alias'],
    ['Название', 'name'],
    ['Бренд', 'brand'],
    ['Артикул', 'code'],
    ['Коллекция', 'collection'],
    ['Общая толщина/толщина', 'totalThickness'],
    ['Цена', 'price']
];

const start = async () => {
    console.log('start extracting products');

    const products = await knex('products')
        .select([
            'products.alias',
            'products.name',
            'products.description',
            'products.id',
            'categories.name as category',
            'collections.name as collection',
            'products.connectionType',
            'products.totalThickness',
            'brands.name as brand',
            'prices.price',
            knex.raw('COALESCE(json_agg(media) FILTER (WHERE media."entityId" IS NOT NULL), null) as imgs')
        ])
        .leftJoin('prices', function () {
            this.on(function () {
                this.on('prices.entityId', '=', 'products.id');
                this.on('prices.entity', '=', entity.PRODUCT);
            });
        })
        .leftJoin('categories', 'categories.id', 'categoryId')
        .leftJoin('collections', 'collections.id', 'collectionId')
        .leftJoin('brands', 'brands.id', 'brandId')
        .whereNull('products.deleted_at')
        .whereNull('collections.deleted_at')
        .orderBy('brands.name');

    console.log('start extracting products3');
    
    const workbook = new excel.Workbook();
    console.log('start extracting products2');
    
    const worksheet = workbook.addWorksheet(category);

    const row = 1;

    columns.forEach(([column], index) => {
        worksheet.cell(1, index+1).string(column);
    });
        

    workbook.write('Prices.xlsx');
    console.log('End extracting');
    // process.exit()
};


module.exports = {
    start
};
