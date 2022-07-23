const {fields} = require('./consts');
const {getCategories} = require('../../utils/getCategories');
const {getCollections} = require('../../utils/getCollections');
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
            getCollections({knex: this.knex, brand: 'primavera'})
        ]);

        this.categories = categories;
        this.collections = collections;
    }

    async save() {
        await this.init();

        const items = this.products.map((item) => {
            if (item.name.includes('Golden Beige')) {
                item.collection = 'Golde Beige';
            } else if (item.name.includes('Namibia Marble')) {
                item.collection = 'Namibian Marble';
            } else {
                item.collection = this.collections.find(({nameDealer}) => item.name.toLowerCase().includes(nameDealer.toLowerCase()))?.nameDealer;
            }
            return item;
        });

        const inserter = new Insert({
            items,
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
