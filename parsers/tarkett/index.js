const knex = require('../../knex');
const {BaseParser} = require('../BaseParser');
const {getCollections} = require('../../service/parsing/getCollections');
const {getCategories} = require('../../service/parsing/getCategories');
const {Strategy} = require('./Strategy');
const {SaveProducts} = require('./save/SaveProducts');
const {logger} = require('../utils/Logger');

const baseUrl = 'https://www.tarkett.ru/';

const urls = [
    '/ru_RU/search/collections-json?dependencyField-region_id=RU72&filter-category_b2b%5B%5D=%D0%9B%D0%B0%D0%BC%D0%B8%D0%BD%D0%B0%D1%82',
    '/ru_RU/search/collections-json?dependencyField-region_id=RU72&filter-category_b2b%5B%5D=%D0%9B%D0%B0%D0%BC%D0%B8%D0%BD%D0%B0%D1%82&page=2'
];

const res = require('./tarkett.ignore.json');

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
            {ms: 1000, msBetweenUrl: 500}
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
