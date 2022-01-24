const {getProducts: getProductsQuery} = require('./tools/getProducts');
const knex = require('../knex');
const convert = require('xml-js');
const fs = require('fs');
const {resolve, dirname} = require('path');
const {FileSystem} = require('../parsers/utils/FileSystem');

const start = async () => {
    console.log('start extracting products to yml');

    try {
        await workJson();
        const result = convert.json2xml(json, options);
        save(result);

        console.log('the end');
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};

const workJson = async () => {
    const [readyProducts, categories] = await Promise.all([
        getProductsQuery(knex, [
            'products.categoryId',
            'country',
            'size',
            'color',
            'texture',
            'connectionType'
        ]),
        knex('categories').select(['name', 'id'])
    ]);

    categories.forEach(({name, id}) => {
        json.yml_catalog.shop.categories.push({
            category: {
                _attributes: {id},
                _text: name
            }
        });
    });

    concatJsonProducts(readyProducts);
};

const save = (result) => {
    const src = '/static/files/products.xml';
    const root = FileSystem.findRoot();
    const path = dirname(src);

    FileSystem.mkdirP(resolve(root, path));
    const actualPath = resolve(root, src);

    fs.writeFileSync(actualPath, result);
};

const concatJsonProducts = (products) => {
    products.forEach(({id, name, alias, country, description, brand, categoryId, price, ...product}) => {
        const offer = {
            _attributes: {id},
            name,
            vendor: brand,
            url: `https://master-pola.com/product/${alias.replace(`'`, '&apos')}`,
            price,
            currencyId: 'RUB',
            categoryId,
            delivery: true,
            pickup: true,
            country_of_origin: country,
            description: `  <![CDATA[${description}]]>`
        };

        fields.forEach(([field, name]) => {
            if (product[field]) {
                offer.param = [{_attributes: {name}, _text: product[field]}];
            }
        });

        json.yml_catalog.shop.offers.push({offer});
    });
};

const options = {compact: true};

const fields = [
    ['size', 'Размер'],
    ['color', 'Оттенок'],
    ['texture', 'Дизайн'],
    ['connectionType', 'Тип соединения']
];

const json = {
    "_declaration":
        {
            "_attributes":
                {
                    "version": "1.0",
                    "encoding": "utf-8"
                }
        },
    yml_catalog: {
       // "_attributes": {"date": "1.0"},
        shop: {
            name: "Мастер Пола",
            company: 'Салон напольных покрытий и дверей "Мастер Пола"',
            url: 'https://master-pola.com/',
            currencies: {
                currency: {
                    _attributes: {
                        id: 'RUB',
                        rate: 1
                    }
                }
            },
            categories: [],
            offers: []
        },
    },
};

module.exports = {
    start
};
