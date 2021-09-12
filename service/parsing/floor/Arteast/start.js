const {getUrls} = require('./getUrls');
const {getProducts} = require('./getProducts');
const {fields} = require('./fields');

const {getCollections} = require('../../getCollections');
const {getCategories} = require('../../getCategories');
const {mapToBD} = require('../../mapToBD');
const {insertToBd} = require('../../insertToBd');
const {categorySetFunc} = require('../../categorySetFunc');

const URL = 'https://arteast.pro:8443/api/products?per_page=60&type=quartz_vinyl&/catalog/quartz_vinylconst';
//https://arteast.pro:8443/api/product/710-at

module.exports = {
    startArteast: async ({params, knex}) => {
        const problemCards = [];

        console.log('start startArteast');

        const links = await getUrls({URL});
        const products = await getProducts({links});
        console.log('urls are got');

        const categories = await getCategories({knex});
        console.log('start Arteast - categories are got');

        const collections = await getCollections({knex});
        console.log('start Arteast - collections are got');

        const readyproducts = mapToBD({products, categories, fields, collections, categorySetFunc});
        console.log('start Arteast - readyproducts are got');

        await insertToBd(knex, readyproducts);
        console.log('start Arteast - readyproducts are inserted');

        return !problemCards.length && 'все хорошо!' || `возникли проблемы в ${problemCards}`;
    }
};
