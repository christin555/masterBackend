const {BaseParser} = require('../BaseParser');
const {FileSystem, logger} = require('../utils');
const {Strategy} = require('./Strategy');
const {SaveProducts} = require('./save/SaveProducts');

const knex = require('../../knex');
const baseUrl = 'https://agt.com.ru/';

const urls = [
    'laminat-agt-kolelkcziya-spark',
    'laminat-agt-kolelkcziya-effect-premium',
    'laminat-agt-kolelkcziya-concept',
    'laminat-agt-kolelkcziya-effect-elegance',
    'laminat-agt-kolelkcziya-natura-slim',
    'laminat-agt-kolelkcziya-armonia-natura-slim',
    'laminat-agt-kolelkcziya-armonia-natura-large',
    'laminat-agt-kolelkcziya-natura-ultra-line',
    'laminat-agt-kolelkcziya-natura-line'
];

const start = async() => {
    console.log('start AGT');

    try {
        const parser = new BaseParser(
            baseUrl,
            urls,
            new Strategy(baseUrl),
            {ms: 500, msBetweenUrl: 250}
        );

        const products = await parser.parse();
        // FileSystem.saveToJSON('alpinefloor', products);

        console.log(products);

        const saver = new SaveProducts(
            products,
            {knex, logger}
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