const knex = require('../knex');
const excel = require('excel4node');

const columns = [
    ['id', 'id'],
    ['Название', 'name'],
    ['Бренд', 'brand'],
    ['Категория', 'category'],
    ['Коллекция', 'collection'],
    ['Тип соедеинения', 'connectionType'],
    ['Общая толщина/толщина', 'totalThickness']
];

const start = async () => {
    console.log('start extracting products');

    const products = await knex('products')
        .select([
            'products.id',
            'products.name',
            'categories.name as category',
            'collections.name as collection',
            'products.connectionType',
            'products.totalThickness',
            'brands.name as brand',
        ])
        .leftJoin('categories', 'categories.id', 'categoryId')
        .leftJoin('collections', 'collections.id', 'collectionId')
        .leftJoin('brands', 'brands.id', 'brandId')
        .whereNull('products.deleted_at')
        .whereNull('collections.deleted_at')
        .orderBy('brands.name');

    const productsGrouped = productsGroup(products);
    const workbook = new excel.Workbook();

    Object.entries(productsGrouped).forEach(([category, categoryItems]) => {
        const worksheet = workbook.addWorksheet(category);

        let row = 1;

        columns.forEach(([column], index) => {
            worksheet.cell(1, index+1).string(column);
        });


        categoryItems.forEach((product) => {
            row++;

            columns.forEach((column, index) => {
                const alias = column[1];
                worksheet.cell(row, index +1).string(product[alias]?.toString());
            });
        });
    });

    workbook.write('Excel.xlsx');
    console.log('End extracting');
};

productsGroup = (products) => products.reduce((acc, val) => {
    if (!acc[val.category]) {
        acc[val.category] = [];
    }

    acc[val.category].push(val);

    return acc;
}, {});

module.exports = {
    start
};