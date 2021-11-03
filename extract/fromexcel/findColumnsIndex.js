
const findColumnsIndex = (sheet) => {
    let nameColumn,
        priceColumn,
        collectionColumn;

    for (let r = 0; r < 20; r++) {
        const cell = sheet.getCell(0, r);

        if (cell?.value === 'Название') {
            nameColumn = r;
        }

        if (cell?.value === 'Цена') {
            priceColumn = r;
        }

        if (cell?.value === 'Коллекция') {
            collectionColumn = r;
        }

        if (nameColumn && priceColumn && collectionColumn) {
            break;
        }
    }

    return {nameColumn, priceColumn, collectionColumn};
};

module.exports = {
    findColumnsIndex
};