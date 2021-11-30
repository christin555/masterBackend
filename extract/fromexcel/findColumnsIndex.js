
const findColumnsIndex = (sheet) => {
    let aliasColumn,
        priceColumn;

    for (let r = 0; r < 20; r++) {
        const cell = sheet.getCell(0, r);

        if (cell?.value === 'alias') {
            aliasColumn = r;
        }

        if (cell?.value === 'Цена') {
            priceColumn = r;
        }

        if (aliasColumn && priceColumn) {
            break;
        }
    }

    return {aliasColumn, priceColumn};
};

module.exports = {
    findColumnsIndex
};
