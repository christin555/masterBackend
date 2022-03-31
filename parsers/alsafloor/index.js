0const {Strategy} = require('./Strategy');
const {BaseParser} = require('../BaseParser');
const {SaveProducts} = require('./save/SaveProducts');

const baseUrl = 'http://www.alsafloor.ru/';

const urls = [
    '/collection/laminat-alsafloor-solid-medium',
    '/collection/laminat-alsafloor-solid-plus',
    '/collection/laminat-alsafloor-solid-chic',
    '/collection/laminat-alsafloor-creative-baton-rompu-herringbone',
    '/collection/laminat-alsafloor-osmoze',
    '/collection/laminat-alsafloor-osmoze-medium'
];

const knex = require('../../knex');
const {Transformer} = require('./save/Transformer');
const {start: edzStart} = require('./edz');
const {logger} = require('../utils/Logger');

const start = async() => {
    logger.debug('start alsafloor');

    const strategy = new Strategy();
    const parser = new BaseParser(
        baseUrl,
        urls,
        strategy,
        {ms: 500, msBetweenUrl: 250}
    );

    try {
        const [
            alsafloor,
            edz
        ] = await Promise.all([
            parser.parse(),
            edzStart()
        ]);

        // Можно сохранить промежуточные результаты для экспериментов
        // Чтобы не парсить каждый раз
        // FileSystem.saveToJSON('alsafloor', alsafloor);
        // FileSystem.saveToJSON('edz', edz);

        const products = new Transformer({alsafloor, edz}).map();
        const saver = new SaveProducts(products, knex, logger);

        // FileSystem.saveToJSON('matches', products);

        await saver.save();
    } catch(e) {
        console.log(`Parser is broke ${e.message}`);
    } finally {
        await knex.destroy();
    }
};

module.exports = {start};

