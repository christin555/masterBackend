const {getProducts} = require('../products/getProducts');
const {getFirstLevels} = require('./getFirstLevels');
const {getNextLevelCategory} = require('./getNextLevelCategory');
const {getCategoryByAlias} = require('./getCategoryByAlias');
const {getCategoryUnder} = require('./getCategoryUnder');

module.exports = {
    getCatalog: async ({body, knex}) => {
        const {searchParams, limit, offset} = body;
        const {category, filter = {}} = searchParams;
        let categories;
        let products;

        const bodyProducts = {
            limit, offset, filter
        };

        //Если первый уровень иерархии и не быстрый поиск, то возвращаем категории первого уровня и все товары
        if (!category && !filter?.search) {
            categories = await getFirstLevels({knex});
            products = await getProducts({knex, body: bodyProducts, category});
        }

        if (category) {
            const {id: categoryId, isLast} = await getCategoryByAlias({knex, alias: category});

            //Если уровень последний, то ниже уже нет категорий, поэтому возввращаем только товары
            if (isLast) {
                filter.categoryIds = [categoryId];
            }
            //Иначе получаем ирерархию категорий и айдишники подкатегорий и их товары
            else {
                categories = await getNextLevelCategory({knex, categoryId});
                filter.categoryIds = await getCategoryUnder({categoryIds: [categoryId], knex});
            }

            products = await getProducts({knex, body: bodyProducts, category});
        } else if(filter?.search){
            categories = await getFirstLevels({knex});
            products = await getProducts({knex, body: bodyProducts, category});
        }

        return {categories, products};
    }
};
