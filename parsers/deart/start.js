const {parseUrls} = require('./parseUrls');
const {parse} = require('./parse');
const {getCollections} = require('../../service/parsing/getCollections');
const {mapToBD} = require('../../service/parsing/mapToBD');
const {insertToBd} = require('../../service/parsing/insertToBd');
const {fields} = require('./fields');
const {getCategories} = require('../../service/parsing/getCategories');
const {categorySetFunc} = require('../../service/parsing/categorySetFunc');

const collectionUrls = [
    'https://deartfloor.ru/catalog/deart-optim/',
    'https://deartfloor.ru/catalog/deart-lite/',
    'https://deartfloor.ru/catalog/deart-strong/',
    'https://deartfloor.ru/catalog/deart-eco-click/'
];

module.exports = {
    startDeart: async ({params, knex}) => {
        const problemCards = [];
        console.log('start Deart');

        const urls = await parseUrls(collectionUrls);
        console.log('urls are got');

        const products = await parse({urls, problemCards});
        console.log('start Deart - products are got');

        const categories = await getCategories({knex});
        console.log('start Decoria - categories are got');

        const collections = await getCollections({knex});
        console.log('start Decoria - collections are got');

        const readyproducts = mapToBD({products, categorySetFunc, categories, fields, collections});
        console.log('start Decoria - readyproducts are got');

        await insertToBd(knex, readyproducts);
        console.log('start Decoria - readyproducts are inserted');

        return !problemCards.length && 'все хорошо!' || `возникли проблемы в ${problemCards}`;
    }
};
