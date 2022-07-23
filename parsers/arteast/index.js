const {getUrls} = require("./getUrls");
const {getProducts} = require("./getProducts");
const {getCategories} = require("../utils/getCategories");
const {getCollections} = require("../utils/getCollections");
const {mapToBD} = require("../oldFuckingParsing/mapToBD");
const {fields} = require("./fields");
const {categorySetFunc} = require("../oldFuckingParsing/categorySetFunc");
const {insertToBd} = require("../oldFuckingParsing/insertToBd");

const URLs = [
    'https://arteast.pro:8443/api/products?per_page=60&type=quartz_vinyl&/catalog/quartz_vinylconst',
    'https://arteast.pro:8443/api/products?per_page=60&type=stone_polymer'
];
//https://arteast.pro:8443/api/product/710-at

const start = async ({knex}) => {
    const problemCards = [];

    console.log('start startArteast');

    const links = await getUrls({URLs});
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

};

module.exports = {start};
