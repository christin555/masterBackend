const {GoogleSpreadsheet} = require('google-spreadsheet');
const {getRows} = require('./getRows');
const knex = require('../../knex');
const {getBdRows} = require("./getBdRows");
const {insertPrices} = require('./insertPrices');

require('dotenv').config();

const docid = '1pI11cJ2ISC1kkrioJOyTCPT3E4JkWsTY7ouuunfeDkQ';

const start = async () => {
    console.log('start extracting products prices');

    const doc = new GoogleSpreadsheet(docid);
    await doc.useApiKey(process.env.GOOGLE_API_KEY);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells('A1:Z1000');

    const rows = getRows({sheet, knex});
    const bdRows = await getBdRows({rows, knex});

    await insertPrices({rows, bdRows, knex});
};


module.exports = {
    start
};
