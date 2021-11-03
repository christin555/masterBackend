const {entity} = require("../../enums");
const insertPrices = ({rows, bdRows, knex}) => {
    const _rows = bdRows.map(({id, name, collectionId, categoryId}) => {
        const price = rows.find(({name: _name, collectionId: _collectionId, categoryId: _categoryId}) =>
            name === _name && collectionId === _collectionId && categoryId === _categoryId
        )?.price;

        return {
            entity: entity.PRODUCT,
            entityId: id,
            price,
        };
    });

    return knex('prices')
        .insert(_rows)
        .onConflict(['entity', 'entityId'])
        .merge();
};

module.exports = {
    insertPrices
};