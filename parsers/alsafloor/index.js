const {FileSystem, Utils} = require('../utils');
const {Strategy} = require('./Strategy');
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
const {startParse} = require('./edz');
const alsafloor = require('./alsafloor.ignore.json');
const edz = require('./edz.ignore.json');

const parseFull = async() => {
    const strategy = new Strategy();
    const parser = new BaseParser(
        baseUrl,
        urls,
        strategy,
        {ms: 500, msBetweenUrl: 250}
    );

    // const alsafloor = await parser.parse();
    // const edz = await startParse();

    // FileSystem.saveToJSON('alsafloor', alsafloor);
    // FileSystem.saveToJSON('edz', edz);

    const logger = {
        debug: console.log
    };

    try {
        const products = new Transformer({alsafloor, edz}).map();
        const saver = new SaveProducts(products, knex, logger);

        FileSystem.saveToJSON('matches', products);

        await saver.save();
    } finally {
        await knex.destroy();
    }
};

parseFull();

