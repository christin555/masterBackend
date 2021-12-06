const {BaseParser} = require('../BaseParser');
const {FileSystem, logger} = require('../utils');
const {Strategy} = require('./Strategy');
const {SaveProducts} = require('./save/SaveProducts');

const knex = require('../../knex');
const baseUrl = 'https://www.polivana.ru';

const ids = [
    'PR208', 'GR202','NR202','PR204','PR205','PR206','NR201','PR209','GR203',
    'PR210','PR212','LR204','LR203',
    'PR211','PR211','PR201','PR202','PR203','PR203',
    'LR201','GR201','PR111','PR108','PR114','NR102','PR104','PR105',
    'PR106','PR110','PR109','NR101','PR117','GR101','PR112','PR116','PR101',
    'PR102','PR103','PR107','PR115','PR113'
];

const start = async() => {
    console.log('start primaver');
    const urls = ids.map((id)=>encodeURI(decodeURI(`/search/index.php?s=Найти&q=${id}`)));

    try {
        const parser = new BaseParser(
            baseUrl,
            urls,
            new Strategy(baseUrl),
            {ms: 200, msBetweenUrl: 50}
        );

        const products = await parser.parse();
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
