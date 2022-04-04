//data: [{ids, data}]
const {updatePrices} = require("./updatePrices");

module.exports = {
    editProducts: async ({body, knex, logger}) => {
        const {ids, data} = body;
        console.log(ids, data);

        if (!ids?.length) {
            return;
        }

        const promises = [];
        const [columns, products] = await Promise.all([
            getColumns(knex),
            getProducts(knex, ids)
        ]);

        const _data = Object.entries(data).reduce((res, [key, val]) => {

            if (columns.includes(key)) {
                res[key] = val;
            }
            return res;
        }, {});

        if (data.price) {
            promises.push(updatePrices({
                body: {
                    products: ids.map(id => {
                        return {newPrice: data.price, id};
                    })
                }, knex
            }));
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
