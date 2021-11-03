const fields = [
    'id',
    'name',
    'level',
    'alias',
    'isLast'
];

module.exports = {
    getHierarchy: async ({body, knex}) => {
        const {category: alias, product} = body;
        let category, nameProduct, categoryId;

        if (!alias && !product) {
            return {};
        }

        if (product) {
            ({categoryId, name: nameProduct} = await knex("products")
                .first(['categoryId', 'name'])
                .where('alias', product));

            category = await knex("categories")
                .first(fields)
                .where('id', categoryId);

        } else {
            category = await knex("categories")
                .first(fields)
                .where('alias', alias);
        }

        const categoryHead = await knex
            .withRecursive('tmp', (qb) => {
                qb.select(['under', 'head'])
                    .from('hierarchy')
                    .where('under', category.id)
                    .unionAll((sqb) => {
                        sqb
                            .select(['hierarchy.under', 'hierarchy.head'])
                            .from('tmp')
                            .join('hierarchy', 'hierarchy.under', 'tmp.head');
                    });
            })
            .from('tmp')
            .select()
            .join('categories', 'categories.id', 'tmp.head')
            .whereNull('categories.deleted_at');


        const hierarchy = [...categoryHead, category].map((item) => {
            return {
                alias: item.alias,
                name: item.name,
                level: item.level
            };
        }).sort((a, b) => a.level - b.level);

        if(nameProduct){
            hierarchy.push({name: nameProduct});
        }
        return {
            isLastLevel: category.isLast,
            hierarchy
        };
    }
};
