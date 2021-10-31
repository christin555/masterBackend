const {Laminate} = require('../catalog/Filter/filters/laminate');

const searchHandlers = {
  laminate: Laminate
};

const createSearch = (category, knex, filter) => {
  if (!searchHandlers[category]) {
    return null;
  }

  return new searchHandlers[category](knex, filter);
};

module.exports = {
  createSearch
};
