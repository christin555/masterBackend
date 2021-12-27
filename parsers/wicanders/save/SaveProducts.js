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
        const [categories, collections] = await Promise.all([
            getCategories({knex: this.knex}),
            getCollections({knex: this.knex, brand: 'wicanders'})
        ]);

        this.categories = categories;
        this.collections = collections;
    }

    async save() {
        await this.init();

        const inserter = new Insert({
            items: this.products,
            collections: this.collections,
            categories: this.categories,
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
