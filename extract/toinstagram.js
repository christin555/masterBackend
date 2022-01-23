const knex = require('../knex');
const excel = require('excel4node');
const {getProducts: getProductsQuery} = require('./tools/getProducts');

const columns = [
    ['id'],
    ['title', 'name'],
    ['description'],
    ['price'],
    ['brand'],
    ['availability'],
    ['condition'],
    ['link'],
    ['fb_product_category'],
    ['google_product_category'],
    ['image_link'],
    ['status'],
    ['additional_image_link'],
    ['category'],
];

const status = 'active';
const fb_cat = {
    'laminate_qvarz': 1459,
    other: 1454
};
const condition = 'new';
const availability = 'available for order';
const google_product_category = 2826;

const start = async () => {
    console.log('start extracting products to insta');

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('');
    let row = 1;

    const readyProducts = await getProducts(knex);

    columns.forEach(([column], index) => {
        worksheet.cell(1, index + 1).string(column);
    });

    readyProducts.forEach((product) => {
        row++;

        columns.forEach((column, index) => {
            const alias = column[1] || column[0];
            worksheet.cell(row, index + 1).string(product[alias]?.toString());
        });

    });

    workbook.write('inst.xlsx');
    console.log('End extracting');
};

const getProducts = async (knex) => {
    const products = await getProductsQuery(knex);

    return products.map(({alias, collection, categoryname, name, category, imgs, ...item}) => {
        const image_link = `https://master-pola.com${imgs[0]?.src}`;
        const additional_image_link = imgs?.slice(1).map(({src}) => `https://master-pola.com${src}`).join(',');

        return {
            ...item,
            condition,
            availability,
            google_product_category,
            status,
            link: `https://master-pola.com/product/${alias}`,
            name: name.length < 65 ? `${name} | ${collection}` : name,
            image_link,
            additional_image_link,
            fb_product_category: ['laminate', 'quartzvinyl_kleevay', 'quartzvinyl_zamkovay'].includes(category) ?
                fb_cat['laminate_qvarz'] : fb_cat['other'],
            category: categoryname
        };
    });
};

module.exports = {
    start
};
