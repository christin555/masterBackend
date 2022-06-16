'use strict';

const {getCatalog} = require('./catalog/getCatalog');
const {getHierarchy} = require('./catalog/getHierarchy');
const {countProducts} = require('./products/countProducts');
const {getProduct} = require('./products/getProduct');
const {getPopular} = require('./products/getPopular');
const {getProducts} = require('./products/getProducts');

const {getServices} = require('./services/getServices');
const {getWorks} = require('./works/getWorks');
const {getRelations} = require('./articles/getRelations');

const {getFilterFields} = require('./catalog/Filter/getFilterFields');

const {getLinks} = require('./getLinks');

const {callme} = require('./send/callme');
const {getArticles} = require('./articles/getArticles');
const {getArticle} = require('./articles/getArticle');

const {upload} = require('./upload');
const {getHeaders} = require('./seo/getHeaders');
const {getCategories} = require('./catalog/getCategories');

const {getSelection} = require('./selections/getSelection');

module.exports = {
    getCatalog,
    getHierarchy,
    upload,
    countProducts,
    getPopular,
    getProducts,

    getServices,
    getWorks,

    getFilterFields,

    getLinks,

    getProduct,

    callme,

    getArticles,
    getArticle,

    getHeaders,

    getCategories,

    getSelection
};
