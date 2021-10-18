const {mapToBD} = require('../../../service/parsing/mapToBD');
const {fields} = require('./consts');
const {insertToBd} = require('../../../service/parsing/insertToBd');
const {getCategories} = require('../../../service/parsing/getCategories');
const {getCollections} = require('../../../service/parsing/getCollections');

class SaveProducts {
    constructor(products, {knex, logger}) {
        this.products = products;
        this.logger = logger;
        this.knex = knex;
    }

    async init() {
        const [categories, collections] = await Promise.all([
            getCategories({knex: this.knex}),
            getCollections({knex: this.knex, brand: 'alpine'})
        ]);

        this.categories = categories;
        this.collections = collections;
    }

    async save() {
        await this.init();

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