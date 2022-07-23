const {getCategories} = require('./utils/getCategories');
const {getCollections} = require('./utils/getCollections');
const {Insert} = require('./utils');

class SaveProducts {
    constructor(products, {knex, logger, brand, fields}) {
        this.products = products;
        this.fields = fields;
        this.logger = logger;
        this.knex = knex;
        this.brand = brand;
    }

    async init() {
        const [categories, collections] = await Promise.all([
            getCategories({knex: this.knex}),
            getCollections({knex: this.knex, brand: this.brand})
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
            fields: this.fields,
            logger: this.logger,
            knex: this.knex
        });

        this.logger.debug('products ready to insert');
        await inserter.insert();
        this.logger.debug('products successful inserted');
    }
}

module.exports = {SaveProducts};
