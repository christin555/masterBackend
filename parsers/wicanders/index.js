const {BaseParser} = require('../BaseParser');
const {FileSystem, logger} = require('../utils');
const {Strategy} = require('./Strategy');
const {SaveProducts} = require('./save/SaveProducts');

const knex = require('../../knex');
const {arts} = require("./articules");
const baseUrl = 'https://wicanders.ru';

const start = async () => {
    console.log('start wicanders');

    // try {
    const parser = new BaseParser(
        baseUrl,
        arts.map((art)=>`/search/results,1-10?virtuemart_category_id=0&keyword=${art}&submit_search=&limitstart=0&option=com_virtuemart&view=category`),
        new Strategy(baseUrl),
        {ms: 500, msBetweenUrl: 250}
    );

    const products = await parser.parse();
    // FileSystem.saveToJSON('alpinefloor', products);

    console.log(new Set(products.map(({collection}) =>collection)));
    const saver = new SaveProducts(
        products,
        {knex, logger}
    );

    await saver.save();

};

module.exports = {
    start
};
