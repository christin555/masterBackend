const {getCollections} = require("../oldFuckingParsing/getCollections");
const {getURL} = require("./getURL");
const {parse} = require("./parse");
const {getCategories} = require("../oldFuckingParsing/getCategories");
const {mapToBD} = require("../oldFuckingParsing/mapToBD");
const {categorySetFunc} = require("../oldFuckingParsing/categorySetFunc");
const {fields} = require("./fields");
const {insertToBd} = require("../oldFuckingParsing/insertToBd");

const start = async({knex}) => {
    const collections = await getCollections({knex, brand: 'moduleo'});
    console.log('startModuleo - collections are got');

    console.log('startModuleo - start');
    const URL = await getURL({knex, collections});

    console.log('startModuleo - URL is got');
    const problemCards = [];

    const products = await parse({URL, problemCards});
    console.log('startModuleo - products are got');

    const categories = await getCategories({knex});
    console.log('startModuleo - categories are got');

    const readyproducts = mapToBD({products, categorySetFunc, categories, fields, collections});
    console.log('startModuleo - readyproducts are got');

    await insertToBd(knex, readyproducts);
    console.log('startModuleo - readyproducts are inserted');

    return !problemCards.length && 'все хорошо!' || `возникли проблемы в ${problemCards}`;
};

module.exports = {start};
