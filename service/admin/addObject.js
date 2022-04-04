const {InsertImages} = require("../../parsers/utils");
const {translitRuEn} = require("../tools/transliter");
const {entity} = require('../../enums');

module.exports = {
    addObject: async ({body, knex, logger}) => {
        const {product} = body;

        product.alias = `${translitRuEn(product._category)}_${translitRuEn(product._collection)}_${translitRuEn(product.name)}`.toLowerCase();

        const images = product.urls?.split(',')?.map((item) => item.trim()) || null;
        const imagesAdd = product.imgsAdd;
        
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

        const afterInsertPromises = [];

        if (images) {
            this.imageInsert = new InsertImages(knex, logger);
            const _alias = alias + '_' + Date.now().toString();
            this.imageInsert.fillImages({alias: _alias, images});
            afterInsertPromises.push(this.imageInsert.insert([{id, alias: _alias, name, images}]));
        }
        
        if (imagesAdd) {
            const _imagesAdd = imagesAdd.map(({src, isMain}) => {
                return {
                    entity: entity.PRODUCT,
                    entityId:id,
                    src: src,
                    isMain
                };
            }).flat();

            afterInsertPromises.push(knex('media').insert(_imagesAdd));
        }
        
        if (price) {
            afterInsertPromises.push(knex('prices')
                .insert({price, entityId: id, entity: entity.PRODUCT}));
        }

        await Promise.all(afterInsertPromises);

        return alias;
    }
};
