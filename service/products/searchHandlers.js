const {Floors} = require('../catalog/Filter/filters/floors');
const {Doors} = require('../catalog/Filter/filters/doors');

const searchHandlers = {
    laminate: Floors,
    quartzvinyl: Floors,
    quartzvinyl_zamkovay: Floors,
    quartzvinyl_kleevay: Floors,
    keramogranit: Floors,
    sport: Floors,
    doors: Doors,
    probkovoe_pokrytie: Floors
};

const createSearch = (category, knex, filter) => {
    if (!searchHandlers[category]) {
        return null;
    }

    return new searchHandlers[category](knex, filter, category);
};


module.exports = {
    createSearch
};
