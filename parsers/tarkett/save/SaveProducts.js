const {mapToBD} = require('../../../service/parsing/mapToBD');
const {fields} = require('./consts');
const {insertToBd} = require('../../../service/parsing/insertToBd');

class SaveProducts {
    constructor(products, collections, categories, {knex, logger}) {
        this.products = products;
        this.collections = collections;
        this.categories = categories;
        this.logger = logger;
        this.knex = knex;
    }

    async save() {
        const readyProducts = mapToBD({
            products: this.products,
            collections: this.collections,
            categories: this.categories,
            fields
        });

        this.logger.debug('products ready to insert');

        await insertToBd(this.knex, readyProducts);

        this.logger.debug('products successful inserted');
    }
}

module.exports = {SaveProducts};