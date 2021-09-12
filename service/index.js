'use strict';

const {getCatalog} = require('./catalog/getCatalog');
const {getHierarchy} = require('./catalog/getHierarchy');
const {countProducts} = require('./products/countProducts');

const {getFilterFields} = require('./catalog/Filter/getFilterFields');

const {getProduct} = require('./products/getProduct');

//parsing
const {startModuleo} = require('./parsing/floor/Moduleo/startModuleo');
const {startDecoria} = require('./parsing/floor/Decoria/start');
const {startDeart} = require('./parsing/floor/Deart/start');
const {startOptima} = require('./parsing/doors/Optima/start');
const {startArteast} = require('./parsing/floor/Arteast/start');
const {startTarkett} = require('./parsing/floor/Tarkett/start');
const {getArticles} = require('./articles/getArticles');

const {callme} = require('./send/callme');

const {upload} = require('./upload');

module.exports = {
    getCatalog,
    getHierarchy,
    upload,
    countProducts,

    getFilterFields,

    getProduct,

    startModuleo,
    startDecoria,
    startDeart,
    startOptima,
    startArteast,
    startTarkett,

    callme,

    getArticles
};
