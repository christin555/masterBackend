const {array2Object} = require("../tools/array2Object");
const {getProducts} = require('../products/getProducts');
module.exports = {
    getFields: async ({body, knex}) => {
        const {category} = body;

        const collectionsSql = knex('collections')
            .select([
                'collections.id',
                'collections.name as collection',
                'brands.name as brand',
                'brands.name as size'
            ])
            .leftJoin('brands', 'brands.id', 'brandId');

        if (category) {
            collectionsSql.where('collections.categoryId', category);
        }

        const [columns, collections, translates] = await Promise.all([
            knex('information_schema.columns')
                .select([
                    'column_name',
                    'data_type',
                    'is_nullable'
                ])
                .where('table_name', 'products')
                .whereNotIn('data_type', ['timestamp with time zone', 'timestamp without time zone'])
                .whereNotIn('column_name', ['id', 'alias', 'collectionId', 'categoryId', 'finishingMaterial']),

            collectionsSql,

            knex('catalogItems')
                .pluck('item')
                .leftJoin('catalogs', 'catalogs.id', 'catalogId')
                .where('catalogs.name', 'quartzvinylCardFields')
        ]);

        const ruNames = array2Object(translates, 'name');
        const fields = columns.map(({column_name, is_nullable, data_type}) => {
            return {
                name: column_name,
                type: data_type,
                title: ruNames[column_name]?.title,
                isRequired: is_nullable === 'NO'
            };
        });

        const addFields = [
            {
                name: 'collectionId',
                type: 'select',
                title: 'Коллекция',
                values: collections.map(({id, collection, brand}) => {
                    return {value: id, label: `${collection}(${brand})`};
                }),
                isRequired: true
            },
            {
                name: 'urls',
                type: 'text',
                title: 'Ссылки на фото через запятую',
                isRequired: true
            },
            {
                name: 'price',
                type: 'integer',
                title: 'Цена, руб'
            }
        ];

        return [...addFields, ...fields];
    }
};
