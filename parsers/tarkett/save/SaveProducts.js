const {fields} = require('./consts');
const {Insert} = require('../../utils');

class SaveProducts {
    constructor(products, collections, categories, {knex, logger}) {
        this.insert = new Insert({
            items: products,
            collections,
            categories,
            fields,
            knex,
            logger
        });

        this.logger = logger;
        this.knex = knex;
    }

    async save() {
        this.logger.debug('products ready to insert');
        await this.insert.insert();
        this.logger.debug('products successful inserted');
    }
}

module.exports = {SaveProducts};