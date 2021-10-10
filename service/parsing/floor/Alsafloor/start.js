const {parseUrls} = require('./parseUrls');
const {parse} = require('./parse');

const collectionUrls = [
    'http://www.alsafloor.ru/collection/laminat-alsafloor-solid-medium/',
    'http://www.alsafloor.ru/collection/laminat-alsafloor-solid-plus/',
    'http://www.alsafloor.ru/collection/laminat-alsafloor-solid-chic/',
    'http://www.alsafloor.ru/collection/laminat-alsafloor-creative-baton-rompu-herringbone',
    'http://www.alsafloor.ru/collection/laminat-alsafloor-osmoze',
    'http://www.alsafloor.ru/collection/laminat-alsafloor-osmoze-medium'
];

module.exports = {
    startAlsa: async ({params, knex}) => {
        const problemCards = [];
        console.log('start Alsafloor');

        const urls = await parseUrls(collectionUrls);
        console.log('urls are got');

        const products = await parse({urls, problemCards});
        console.log('start Alsafloor - products are got');

        return products;
    }
};
