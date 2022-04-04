const {InsertImages} = require("../../parsers/utils");
const {translitRuEn} = require("../tools/transliter");
const {entity} = require('../../enums');

module.exports = {
    addObject: async ({body, knex, logger}) => {
        const {product} = body;

        product.alias = `${translitRuEn(product._category)}_${translitRuEn(product._collection)}_${translitRuEn(product.name)}`.toLowerCase();
     
        const images = product.urls?.split(',')?.map((item) => item.trim()) || null;
        const price = product.price;
        
        delete product._category;
        delete product._collection;
        delete product.urls;
        delete product.price;

        const columns = await knex('information_schema.columns')
            .pluck('column_name')
            .where('table_name', 'products');

        const _product = Object.entries(product).reduce((res, [key, val]) => {

            if (columns.includes(key)) {
                res[key] = val;
            }
            return res;
        }, {});

        const [{id, alias, name}] = await knex('products')
            .insert(_product)
            .onConflict('alias')
            .merge()
            .returning(['id', 'alias', 'name']);

        if (images) {
            this.imageInsert = new InsertImages(knex, logger);
            this.imageInsert.fillImages({alias, images});
            await this.imageInsert.insert([{id, alias, name, images}]);
        }
        
        if(price){
            await knex('prices')
                .insert({price, entityId:id, entity: entity.PRODUCT});
        }

        return alias;
    }
};
