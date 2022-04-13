//data: [{ids, data}]
const {InsertImages} = require("../../parsers/utils");
const {updatePrices} = require("./updatePrices");
const {entity} = require('../../enums');

module.exports = {
    editProducts: async ({body, knex, logger}) => {
        const {ids, data} = body;

        if (!ids?.length) {
            return;
        }

        const promises = [];
        const [columns, products] = await Promise.all([
            getColumns(knex),
            getProducts(knex, ids)
        ]);

        const images_urls = data.urls?.split(',')?.map((item) => item.trim()) || null;
        const images = data.imgs;

        const _data = Object.entries(data).reduce((res, [key, val]) => {

            if (columns.includes(key)) {
                res[key] = val;
            }
            return res;
        }, {});

        if (data.price || data.salePrice || data.salePercent) {
            promises.push(updatePrices({
                body: {
                    products: ids.map(id => {
                        const item = {id};
                        data.price && (item.newPrice = data.price);
                        data.salePrice && (item.salePrice = data.salePrice);
                        data.salePercent && (item.salePercent = data.salePercent);
                        return item;
                    })
                }, knex
            }));
        }

        if (images) {

            if (ids.length === 1) {
                await knex('media').update({deletedAt: new Date()}).where({entityId: ids[0], 'entity': entity.PRODUCT});
            }

            const _imagesAdd = images.map(({src, isMain}) => {
                return ids.map((id) => {
                    return {
                        entity: entity.PRODUCT,
                        entityId: id,
                        src: src,
                        isMain,
                        deletedAt: null
                    };
                });
            }).flat();

            promises.push(knex('media').insert(_imagesAdd).onConflict(['entity', 'entityId', 'src']).merge());
        }

        if (images_urls) {
            this.imageInsert = new InsertImages(knex, logger, true);
            const _images = products.map(({id, alias, name}) => {
                const _alias = alias + '_' + Date.now().toString();
                this.imageInsert.fillImages({alias: _alias, images: images_urls});

                return {id, alias: _alias, name, images: images_urls};
            });
            promises.push(this.imageInsert.insert(_images));
        }

        promises.push(knex('products').update(_data).whereIn('id', ids));
        promises.push(knex('logs').insert({
            action: 'massedit',
            data: JSON.stringify({
                oldValues: products,
                ids,
                newValue: _data
            }),
            created_at: new Date()
        }));

        await Promise.all(promises);
    }
};

const getColumns = (knex) => knex('information_schema.columns')
    .pluck('column_name')
    .where('table_name', 'products');

const getProducts = (knex, _ids) => knex('products')
    .select()
    .whereIn('id', _ids);
