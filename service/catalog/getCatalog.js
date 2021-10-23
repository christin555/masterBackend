const {getProducts} = require('../products/getProducts');
const {getFirstLevels} = require('./getFirstLevels');
const {getNextLevelCategory} = require('./getNextLevelCategory');

module.exports = {
    getCatalog: async({body, knex}) => {
        const {searchParams} = body;
        const {category, search} = searchParams;

        if (!category && !search) {
            return getFirstLevels({knex});
        }

        if (search) {
            return getProducts({knex, body});
        }

        if (category) {
            const {id: categoryId, isLast} = await knex('categories')
                .first([
                    'id',
                    'name',
                    'img',
                    'level',
                    'alias',
                    'description',
                    'isLast'
                ])
                .where('alias', category);

            if (isLast) {
                searchParams.categoryId = categoryId;
                return getProducts({knex, body});
            } else {
                return getNextLevelCategory({knex, categoryId});
            }
        }

        return [];
    }
};
