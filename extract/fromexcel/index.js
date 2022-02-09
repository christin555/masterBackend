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
    const rows = [];
    const countsheet = doc.sheetCount;
    
    for(let i = 0; i < countsheet; i++){
        console.log(i)
        const sheet = doc.sheetsByIndex[i];
        await sheet.loadCells('A1:Z1000');
        rows.push(...getRows({sheet}));
    }

    console.log(rows)
    const bdRows = await getBdRows({rows, knex});

    await insertPrices({rows, bdRows, knex});

    console.log('end extracting products prices');
    process.exit();
};


module.exports = {
    start
};
