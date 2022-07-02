const {BaseParser} = require('../BaseParser');
const {FileSystem, logger} = require('../utils');
const {Strategy} = require('./Strategy');
const {SaveProducts} = require('./save/SaveProducts');

const knex = require('../../knex');
const baseUrl = 'https://alpinefloor.su';

const urls = [
    '/catalog/stone-lvt/'
    //'/catalog/quartz-tiles-vinyl-for-walls',
    // '/catalog/light-parquet',
    // '/catalog/intense',
    // '/catalog/classic-collection',
    // '/catalog/collection-easy-line',
    // '/catalog/the-sequoia-collection',
    // '/catalog/collection-stone',
    // '/catalog/grand-stone',
    // '/catalog/the-collection-of-real-wood',
    // '/catalog/premium-xl',
    // '/catalog/solo',
    //
    // '/catalog/related-products/napolnyy-plintus'
];

const start = async() => {
    console.log('start Alpinefloor');

    try {
        const parser = new BaseParser(
            baseUrl,
            urls,
            new Strategy(baseUrl),
            {ms: 500, msBetweenUrl: 250}
        );

        const products = await parser.parse();
        // FileSystem.saveToJSON('alpinefloor', products);

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
