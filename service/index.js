'use strict';

const {getCatalog} = require('./catalog/getCatalog');
const {getHierarchy} = require('./catalog/getHierarchy');
const {countProducts} = require('./products/countProducts');
const {getProduct} = require('./products/getProduct');
const {getPopular} = require('./products/getPopular');

const {getServices} = require('./services/getServices');
const {getWorks} = require('./works/getWorks');
const {getWork} = require('./works/getWork');

const {getFilterFields} = require('./catalog/Filter/getFilterFields');

const {getLinks} = require('./getLinks');

const {callme} = require('./send/callme');
const {getArticles} = require('./articles/getArticles');
const {getArticle} = require('./articles/getArticle');

const {upload} = require('./upload');
const {getHeaders} = require('./seo/getHeaders');

module.exports = {
    getCatalog,
    getHierarchy,
    upload,
    countProducts,
    getPopular,

    getServices,
    getWorks,
    getWork,

    getFilterFields,

    getLinks,

    getProduct,

    callme,

    getArticles,
    getArticle,

    getHeaders
};
