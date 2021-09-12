const {getUrls} = require('./getUrls');
const {parse} = require('./parse');
const {fields} = require('./fields');

const {getCategories} = require('../../getCategories');
const {mapToBD} = require('../../mapToBD');
const {insertToBd} = require('../../insertToBd');
const {categorySetFunc} = require('../../categorySetFunc');

module.exports = {
    startDecoria: async ({params, knex}) => {
        const problemCards = [];

        console.log('start Decoria');

        const {links, prices} = await getUrls({params});
        console.log('urls are got');

        const products = await parse({urls: links, problemCards});
        console.log('products are got');

        const categories = await getCategories({knex});
        console.log('start Decoria - categories are got');

        const collections = [];

        const readyproducts = mapToBD({categorySetFunc, collections, products, categories, fields});
        console.log('start Decoria - readyproducts are got');

        await insertToBd(knex, readyproducts, prices);
        console.log('start Decoria - readyproducts are inserted');

        return !problemCards.length && 'все хорошо!' || `возникли проблемы в ${problemCards}`;
    }
};
