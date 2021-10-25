const knex = require('../../knex');
const {BaseParser} = require('../BaseParser');
const {getCollections} = require('../oldFuckingParsing/getCollections');
const {getCategories} = require('../oldFuckingParsing/getCategories');
const {Strategy} = require('./Strategy');
const {SaveProducts} = require('./save/SaveProducts');
const {logger} = require('../utils/Logger');

const baseUrl = 'https://www.tarkett.ru/';

const urls = [
    '/ru_RU/search/collections-json?dependencyField-region_id=RU72&filter-category_b2b%5B%5D=%D0%9B%D0%B0%D0%BC%D0%B8%D0%BD%D0%B0%D1%82',
    '/ru_RU/search/collections-json?dependencyField-region_id=RU72&filter-category_b2b%5B%5D=%D0%9B%D0%B0%D0%BC%D0%B8%D0%BD%D0%B0%D1%82&page=2',
    '/ru_RU/search/collections-json?dependencyField-region_id=RU72&filter-category_b2b%5B%5D=%D0%A1%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5%20%D0%BD%D0%B0%D0%BF%D0%BE%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D0%BF%D0%BE%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D1%8F',
    '/ru_RU/search/collections-json?dependencyField-region_id=RU72&filter-category_b2b%5B%5D=Art%20Vinyl'
];

//const res = require('./tarkett.ignore.json');

const start = async() => {
    try {
        const [collections, categories] = await Promise.all([
            getCollections({knex, brand: 'tarkett'}),
            getCategories({knex})
        ]);

        logger.debug('start parse tarkett');

        const parser = new BaseParser(
            baseUrl,
            urls,
            new Strategy(collections),
            {ms: 10, msBetweenUrl: 10}
        );

        const res = await parser.parse();

        logger.debug('parse is successful');

        // FileSystem.saveToJSON('tarkett', res.flat());

        const saver = new SaveProducts(
            res.flat(),
            collections,
            categories,
            {knex, logger}
        );

        await saver.save();
    } catch(e) {
        console.log(e);
    } finally {
        await knex.destroy();
    }
};

module.exports = {start};
