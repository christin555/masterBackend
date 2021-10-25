const {getProducts} = require('../products/getProducts');
const {getFirstLevels} = require('./getFirstLevels');
const {getNextLevelCategory} = require('./getNextLevelCategory');
const {getCategoryByAlias} = require('./getCategoryByAlias');
const {getCategoryUnder} = require('./getCategoryUnder');

module.exports = {
    getCatalog: async ({body, knex}) => {
        const {searchParams} = body;
        const {category, filter: {search} = {}} = searchParams;
        let categories;
        let products;


        //Если первый уровень иерархии и не быстрый поиск, то возвращаем категории первого уровня и все товары
        if (!category && !search) {
            categories = await getFirstLevels({knex});
            products = await getProducts({knex, body});
        }

        if (category) {
            const {id: categoryId, isLast} = await getCategoryByAlias({knex, alias: category});

            //Если уровень последний, то ниже уже нет категорий, поэтому возввращаем только товары
            if (isLast) {
                searchParams.categoryIds = [categoryId];
            }
            //Иначе получаем ирерархию категорий и айдишники подкатегорий и их товары
            else {
                categories = await getNextLevelCategory({knex, categoryId});
                searchParams.categoryIds = await getCategoryUnder({categoryIds: [categoryId], knex});
            }

            products = await getProducts({knex, body});
        } else if(search){
            categories = await getFirstLevels({knex});
            products = await getProducts({knex, body});
        }


        return {categories, products};
    }
};
