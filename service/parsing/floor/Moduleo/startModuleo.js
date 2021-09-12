const axios = require("axios");
const cheerio = require('cheerio');
const {getURL} = require('./getURL');
const {parse} = require('./parse');
const {mapToBD} = require('../../mapToBD');
const {getCategories} = require('../../getCategories');
const {insertToBd} = require('../../insertToBd');
const {fields} = require('./fields');
const {getCollections} = require('../../getCollections');
const {categorySetFunc} = require('../../categorySetFunc');

module.exports = {
    startModuleo: async ({body, knex}) => {
        
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
    }
};
