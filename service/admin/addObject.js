const {InsertImages} = require("../../parsers/utils");
const {translitRuEn} = require("../tools/transliter");

module.exports = {
    addObject: async ({body, knex, logger}) => {
        const {product} = body;

        product.alias = `${translitRuEn(product._category)}_${translitRuEn(product._collection)}_${translitRuEn(product.name)}`.toLowerCase();
        const images = product.urls?.split(' ') || null;

        delete product._category;
        delete product._collection;
        delete product.urls;
        delete product.price;

        const [{id, alias, name}] = await knex('products')
            .insert(product)
            .onConflict('alias')
            .merge()
            .returning(['id', 'alias', 'name']);

        if (images) {
            console.log({alias, images});

            this.imageInsert = new InsertImages(knex, logger);
            this.imageInsert.fillImages({alias, images});
            await this.imageInsert.insert([{id, alias, name, images}]);
        }
    }
};
