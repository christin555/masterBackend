const {BaseParser} = require('../BaseParser');
const {FileSystem, logger} = require('../utils');
const {Strategy} = require('./Strategy');
const {SaveProducts} = require('./save/SaveProducts');

const knex = require('../../knex');
const baseUrl = 'https://wicanders.ru';

const urls = [
    '/searsh/results,1-10?option=com_virtuemart&search=true&view=category&mcf_id=298&mids%5B%5D=&cids%5B%5D=29&cpi%5B%5D=14&cv14%5B%5D=&cpi%5B%5D=136&cv136%5B%5D=&cpi%5B%5D=8&cv8%5B%5D=&cpi%5B%5D=10&cv10%5B%5D=&cpi%5B%5D=55&cv55%5B%5D=&cpi%5B%5D=54&cv54%5B%5D=&custom_parent_id=14&limitstart=0&limit=10',
    '/searsh/results,1-10?option=com_virtuemart&search=true&view=category&mcf_id=298&mids%5B%5D=&cids%5B%5D=13&cpi%5B%5D=14&cv14%5B%5D=&cpi%5B%5D=8&cv8%5B%5D=&cpi%5B%5D=136&cv136%5B%5D=&cpi%5B%5D=10&cv10%5B%5D=&cpi%5B%5D=55&cv55%5B%5D=&cpi%5B%5D=54&cv54%5B%5D=&custom_parent_id=14&limitstart=0&limit=10',
    '/searsh/results,1-10?option=com_virtuemart&search=true&view=category&mcf_id=298&mids%5B%5D=&cids%5B%5D=27&cpi%5B%5D=14&cv14%5B%5D=&cpi%5B%5D=8&cv8%5B%5D=&cpi%5B%5D=10&cv10%5B%5D=&cpi%5B%5D=55&cv55%5B%5D=&cpi%5B%5D=54&cv54%5B%5D=&custom_parent_id=14&limitstart=0&limit=10'
];
const start = async () => {
    console.log('start wicanders');

    // try {
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

};

module.exports = {
    start
};
