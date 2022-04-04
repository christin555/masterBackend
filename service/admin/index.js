'use strict';

const {getPricesProducts} = require('./getPricesProducts');
const {updatePrices} = require('./updatePrices');
const {deleteProducts} = require('./deleteProducts');
const {getCategories} = require('../catalog/getCategories');
const {getUser} = require('./getUser');
const {getFields} = require('./getFields');
const {addObject} = require('./addObject');
const {editProducts} = require('./editProducts');
const {getColumns} = require('./getColumns');

module.exports = {
    getPricesProducts,
    updatePrices,
    deleteProducts,
    getUser,
    getFields,
    getCategories,
    addObject,
    editProducts,
    getColumns
};
