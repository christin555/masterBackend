const {Floors} = require('../catalog/Filter/filters/floors');

const searchHandlers = {
    laminate: Floors,
    quartzvinyl: Floors,
    quartzvinyl_zamkovay: Floors,
    quartzvinyl_kleevay: Floors,
    keramogranit: Floors,
    sport: Floors
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
