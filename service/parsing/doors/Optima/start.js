const {parse} = require('./parse');
const {fields} = require('./fields');
const {getCollections} = require('../../getCollections');
const {getCategories} = require('../../getCategories');
const {getFinishingMaterials} = require('../getFinishingMaterials');
const {mapToBD} = require('../mapToBD');
const {insertToBd} = require('../../insertToBd');

const URL = 'http://www.optimaporte.ru/doors';

module.exports = {
    startOptima: async ({params, knex}) => {
        const problemCards = [];
        console.log('start Optima');

        const products = await parse({URL, problemCards});
        console.log('urls are got');

        const categories = await getCategories({knex});
        console.log('start Optima - categories are got');

        const finishingMaterials = await getFinishingMaterials({knex});
        console.log('start Optima - finishingMaterials are got');

        const collections = await getCollections({knex});
        console.log('start Optima - collections are got');

        const readyproducts = mapToBD({products, categories, fields, collections, finishingMaterials});
        console.log('start Optima - readyproducts are got');

        await insertToBd(knex, readyproducts);
        console.log('startModuleo - readyproducts are inserted');

        return !problemCards.length && 'все хорошо!' || `возникли проблемы в ${problemCards}`;
    }
};
