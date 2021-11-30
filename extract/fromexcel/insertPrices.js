const {entity} = require("../../enums");
const {array2Object} = require("../../service/tools/array2Object");

const insertPrices = ({rows, bdRows, knex}) => {
    const _rows = array2Object(rows, 'alias');
    const insertdata = bdRows.map(({id, alias}) => {
        const price = _rows[alias]?.price;

        if (!price) {
            return null;
        }
        return {
            entity: entity.PRODUCT,
            entityId: id,
            price,
        };
    });

    return knex('prices')
        .insert(insertdata.filter(Boolean))
        .onConflict(['entity', 'entityId'])
        .merge();
};

module.exports = {
    insertPrices
};
