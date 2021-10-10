const {getUrls} = require('./getUrls');
const {getProducts} = require('./getProducts');
const {fields} = require('./fields');

const {getCollections} = require('../../getCollections');
const {getCategories} = require('../../getCategories');
const {mapToBD} = require('../../mapToBD');
const {insertToBd} = require('../../insertToBd');

const URL = 'https://www.tarkett.ru/ru_RU/search/collections-json?dependencyField-region_id=RU72&filter-category_b2b%5B%5D=%D0%9B%D0%B0%D0%BC%D0%B8%D0%BD%D0%B0%D1%82';

module.exports = {
    startTarkett: async ({params, knex}) => {
        const problemCards = [];
        console.log('start Tarkett');

        const collections = await getCollections({knex, brand: 'tarkett'});
        console.log('startModuleo - collections are got');


        const links = await getUrls({
            URL,
            collectionsName: collections.map(({nameDealer}) => nameDealer.toLowerCase())
        });
        console.log('urls are got');

        const products = await getProducts({links});
        console.log('products are got');

        const categories = await getCategories({knex});
        console.log('start Tarkett - categories are got');

        const readyproducts = mapToBD({collections, products, categories, fields});
        console.log('start Tarkett - readyproducts are got');

        await insertToBd(knex, readyproducts);
        console.log('start Tarkett - readyproducts are inserted');


        return !problemCards.length && 'все хорошо!' || `возникли проблемы в ${problemCards}`;
    }
};
