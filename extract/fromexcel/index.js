const {GoogleSpreadsheet} = require('google-spreadsheet');
const {getRows} = require('./getRows');
const knex = require('../../knex');
const {getCollections} = require("./getCollections");
const {getCategories} = require("./getCategories");
const {getBdRows} = require("./getBdRows");
const {insertPrices} = require('./insertPrices');

require('dotenv').config();

const docid = '1sesc1mVR7Xf6gOPXzwlfqoKMvy4Oj0VD1HtL_tNZOGU';

const start = async () => {
    console.log('start extracting products prices');
    const collections = await getCollections({knex});
    const categories = await getCategories({knex});

    const doc = new GoogleSpreadsheet(docid);
    await doc.useApiKey(process.env.GOOGLE_API_KEY);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells('A1:Z1000');

    const rows = getRows({sheet, knex, categories, collections});
    const bdRows = await getBdRows({rows, knex});

    await insertPrices({rows, bdRows, knex});
};


module.exports = {
    start
};