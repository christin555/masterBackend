const {GoogleSpreadsheet} = require('google-spreadsheet');
require('dotenv').config();

module.exports = {
    getUrls: async ({params}) => {
        const {docid} = params;
        const doc = new GoogleSpreadsheet(docid);

        await doc.useApiKey(process.env.GOOGLE_API_KEY);
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];

        await sheet.loadCells('A1:Z50');

        const {artColumn, priceColumn} = findColumn(sheet);

        return getUrls({sheet, artColumn, priceColumn});
    }
};

const findColumn = (sheet) => {
    let artColumn,
        priceColumn;
    for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = sheet.getCell(r, c);
            if (cell.value === 'Артикул') {
                artColumn = c;
            }
            if (cell.value && cell.value.includes('РРЦ')) {
                console.log('price', c);
                priceColumn = c;
            }
            if(artColumn && priceColumn){
                break;
            }
        }
        if(artColumn && priceColumn){
            break;
        }
    }

    return {artColumn, priceColumn};
};

const getUrls = ({sheet, artColumn, priceColumn}) => {
    const links = [];
    const prices = {};
    
    for (let r = 0; r < 20; r++) {
        const art = sheet.getCell(r, artColumn);
        art.hyperlink && (links.push(art.hyperlink));

        const price = sheet.getCell(r, priceColumn);
        
        if(Number(price.value)){
            prices[art.value] = price.value;
        }
    }
    return {links, prices};
};
