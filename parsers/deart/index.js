const {parseUrls} = require("./parseUrls");
const {parse} = require("./parse");
const {getCategories} = require("../oldFuckingParsing/getCategories");
const {getCollections} = require("../oldFuckingParsing/getCollections");
const {mapToBD} = require("../oldFuckingParsing/mapToBD");
const {categorySetFunc} = require("../oldFuckingParsing/categorySetFunc");
const {fields} = require("./fields");
const {insertToBd} = require("../oldFuckingParsing/insertToBd");

const collectionUrls = [
    'https://deartfloor.ru/catalog/deart-optim/',
    'https://deartfloor.ru/catalog/deart-lite/',
    'https://deartfloor.ru/catalog/deart-strong/',
    'https://deartfloor.ru/catalog/deart-eco-click/'
];

const start = async({knex}) => {
    const problemCards = [];
    console.log('start Deart');

    const urls = await parseUrls(collectionUrls);
    console.log('urls are got');

    const products = await parse({urls, problemCards});
    console.log('start Deart - products are got');

    const categories = await getCategories({knex});
    console.log('start Deart - categories are got');

    const collections = await getCollections({knex});
    console.log('start Deart - collections are got');

    const readyproducts = mapToBD({products, categorySetFunc, categories, fields, collections});
    console.log('start Deart - readyproducts are got');

    await insertToBd(knex, readyproducts);
    console.log('start Deart - readyproducts are inserted');

    return !problemCards.length && 'все хорошо!' || `возникли проблемы в ${problemCards}`;
};

module.exports = {start};
