const {FileSystem, Utils} = require('../../utils');
const {Strategy} = require('./Strategy');
const {BaseParser} = require('../../BaseParser');

const baseUrl = 'https://e-dz.ru';

const urls = [
    '/catalog/solid-medium',
    '/catalog/solid-plus',
    '/catalog/solid-chic',
    '/catalog/osmoze',
    '/catalog/laminat-alsafloor-herringbone',
    '/catalog/osmoze',
    '/catalog/osmoze-medium'
];

const startParse = async() => {
    const strategy = new Strategy();
    // Для получения всех данных
    const _urls = urls.map((url) => `${url}?per-page=96`);
    const parser = new BaseParser(
        baseUrl,
        _urls,
        strategy,
        {ms: 1000}
    );

    const items = await parser.parse();

    // FileSystem.saveToJSON('../edz', items);

    return items;
};

module.exports = {
    startParse
};