const {FileSystem} = require('./FileSystem');
const {LinksIterator} = require('./LinksIterator');
const {Utils} = require('./Utils');
const {logger} = require('./Logger');
const {Insert} = require('./Insert');
const {ImageHashIterator} = require('./ImageIterator');
const {ImageSaver} = require('./ImageSaveIterator');
const {InsertImages} = require('./InsertImages');

module.exports = {
    FileSystem,
    LinksIterator,
    Utils,
    logger,
    Insert,
    ImageHashIterator,
    ImageSaver,
    InsertImages
};