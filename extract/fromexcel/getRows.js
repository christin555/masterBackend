const {findColumnsIndex} = require("./findColumnsIndex");

const getRows = ({sheet}) => {
    const {aliasColumn, priceColumn} = findColumnsIndex(sheet);
    const rows = [];

    for (let r = 1; r < 300; r++) {
        const price = sheet.getCell(r, priceColumn)?.value;
        const alias = sheet.getCell(r, aliasColumn)?.value;

        if (price) {
            rows.push({
                alias,
                price
            });
        }
    }

    return rows;
};

module.exports = {
    getRows
};
