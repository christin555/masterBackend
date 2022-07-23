const {BaseParser} = require('../BaseParser');
const {logger} = require('../utils');
const {Strategy} = require('./Strategy');
const {SaveProducts} = require('../SaveProducts');
const {fields} = require('./consts');
const knex = require('../../knex');
const baseUrl = 'https://finefloor.ru';

const urls = [
    '/catalog/stone/?SHOWALL_2=1',
    '/catalog/wood/?SHOWALL_2=1',
    '/catalog/zamkovyy-tip/ff-1800/?SHOWALL_2=1',
];

const start = async() => {
    console.log('start Finefloor');

    try {
        const parser = new BaseParser(
            baseUrl,
            urls,
            new Strategy(baseUrl),
            {ms: 500, msBetweenUrl: 250}
        );

        const products = await parser.parse();

        console.log(products);
        const saver = new SaveProducts(
            products,
            {knex, logger, brand: 'finefloor', fields}
        );

        await saver.save();
    } catch(e) {
        console.log('Error when parse', e.message);
    } finally {
        await knex.destroy();
    }
};

module.exports = {
    start
};
