const {
    FileSystem
} = require('../utils');
const {Strategy} = require('./Strategy');
const {BaseParser} = require('../BaseParser');

const baseUrl = 'http://www.alsafloor.ru/';

const urls = [
    '/collection/laminat-alsafloor-solid-medium',
    '/collection/laminat-alsafloor-solid-plus',
    '/collection/laminat-alsafloor-solid-chic',
    '/collection/laminat-alsafloor-creative-baton-rompu-herringbone',
    '/collection/laminat-alsafloor-osmoze',
    '/collection/laminat-alsafloor-osmoze-medium'
];

const parseFull = async() => {
    const strategy = new Strategy();
    const parser = new BaseParser(
        baseUrl,
        urls,
        strategy,
        {ms: 1000, msBetweenUrl: 250}
    );

    const res = await parser.parse();

    FileSystem.saveToJSON('all', res);
};

parseFull();

