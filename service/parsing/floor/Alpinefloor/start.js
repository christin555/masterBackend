const {parseUrls} = require('./parseUrls');
const {parse} = require('./parse');
const {fields} = require('./fields');

const {getCollections} = require('../../getCollections');
const {getCategories} = require('../../getCategories');
const {mapToBD} = require('../../mapToBD');
const {insertToBd} = require('../../insertToBd');
const {categorySetFunc} = require('../../categorySetFunc');

const collectionUrls = [
    'grand-sequoia',
    'expressive',
    'light-parquet',
    'intense',
    'classic-collection',
    'collection-easy-line',
    'the-sequoia-collection',
    'collection-stone'
];

module.exports = {
    startAlpine: async ({knex}) => {
        const problemCards = [];
        console.log('start Alpinefloor');

        const urls = await parseUrls(
            collectionUrls.map((collection) => `https://alpinefloor.su/catalog/${collection}`)
        );
        console.log('urls are got');

        const products = await parse({urls, problemCards});
        console.log('start Alpinefloor - products are got');

        const categories = await getCategories({knex});
        console.log('start Alpinefloor - categories are got');

        const collections = await getCollections({knex, brand: 'alpine'});
        console.log('start Alpinefloor - collections are got');

        const readyproducts = mapToBD({products, categorySetFunc, categories, fields, collections});
        console.log('start Alpinefloor - readyproducts are got');

        await insertToBd(knex, readyproducts);
        console.log('start Alpinefloor - readyproducts are inserted');

        return !problemCards.length && 'все хорошо!' || `возникли проблемы в ${problemCards}`;
    }
};
