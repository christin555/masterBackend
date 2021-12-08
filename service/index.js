'use strict';

const {getCatalog} = require('./catalog/getCatalog');
const {getHierarchy} = require('./catalog/getHierarchy');
const {countProducts} = require('./products/countProducts');
const {getProduct} = require('./products/getProduct');
const {getPopular} = require('./products/getPopular');

const {getFilterFields} = require('./catalog/Filter/getFilterFields');

const {getLinks} = require('./getLinks');

const {callme} = require('./send/callme');
const {getArticles} = require('./articles/getArticles');
const {getArticle} = require('./articles/getArticle');

const {upload} = require('./upload');

module.exports = {
    getCatalog,
    getHierarchy,
    upload,
    countProducts,
    getPopular,

    getFilterFields,

    getLinks,

    getProduct,

    callme,

    getArticles,
    getArticle
};
