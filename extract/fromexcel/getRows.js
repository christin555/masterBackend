const {findColumnsIndex} = require("./findColumnsIndex");

const getRows = ({sheet, categories, collections}) => {
    const {nameColumn, priceColumn, collectionColumn} = findColumnsIndex(sheet);
    const rows = [];

    for (let r = 1; r < 300; r++) {
        const price = sheet.getCell(r, priceColumn)?.value;
        const collection = sheet.getCell(r, collectionColumn)?.value;
        const name = sheet.getCell(r, nameColumn)?.value;

        if (price) {
            rows.push({
                name,
                collectionId: collections[collection]?.id,
                price,
                categoryId: categories['laminate']?.id,
            });
        }
    }

    return rows;
};

module.exports = {
    getRows
};