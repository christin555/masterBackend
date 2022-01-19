const {getFinishingMaterials} = require("../../oldFuckingParsing/doors/getFinishingMaterials");
const {fields} = require('./consts');
const {getCategories} = require('../../oldFuckingParsing/getCategories');
const {getCollections} = require('../../oldFuckingParsing/getCollections');
const {Insert} = require('../../utils');

class SaveProducts {
    constructor(products, {knex, logger}) {
        this.products = products;
        this.logger = logger;
        this.knex = knex;
    }

    async init() {
        const [categories, collections, finishingMaterials] = await Promise.all([
            getCategories({knex: this.knex}),
            getCollections({knex: this.knex, brand: 'synergi'}),
            getFinishingMaterials({knex:  this.knex})
        ]);

        this.categories = categories;
        this.finishingMaterials = finishingMaterials.filter(({dataId}) => Boolean(dataId));
        this.collections = collections;
    }

    async save() {
        await this.init();

        const inserter = new Insert({
            items: this.products,
            collections: this.collections,
            categories: this.categories,
            finishingMaterials: this.finishingMaterials,
            fields,
            logger: this.logger,
            knex: this.knex
        });

        this.logger.debug('products ready to insert');
        await inserter.insert();
        this.logger.debug('products successful inserted');
    }
}

module.exports = {SaveProducts};
