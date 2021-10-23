'use strict';
const {
    categories,
    brands,
    catalogs,
    collections,
    finishingMaterialDoors,
    hierarchy,
    catalogItems,
    conditions,
    articles,
    media
} = require('./migrationsData/initData');
const {array2Object} = require('../service/tools/array2Object');

exports.up = async(knex) => {
    const [_catalogs, _categories, _brands] = await Promise.all([
        knex.table('catalogs').insert(catalogs).returning(['name', 'id']),
        knex.table('categories').insert(categories).returning(['alias', 'id']),
        knex.table('brands').insert(brands).returning(['alias', 'id']),
        knex.table('finishingMaterialDoors').insert(finishingMaterialDoors),
        knex.table('media').insert(media),
        knex.table('articles').insert(articles)
    ]);

    const catalogObject = array2Object(_catalogs, 'name');
    const categoriesObject = array2Object(_categories, 'alias');
    const brandsObject = array2Object(_brands, 'alias');

    const catItems = catalogItems.reduce((array, {items, name}) => {
        const newItems = [];

        items.forEach((item) => {
            newItems.push({
                catalogId: catalogObject[name].id,
                item
            });
        });

        return [...array, ...newItems];
    }, []);

    await knex.table('catalogItems').insert(catItems);

    const hierItems = hierarchy.reduce((array, {head, under}) => {
        const newItems = [];

        under.forEach((item) => {
            newItems.push({
                head: categoriesObject[head].id,
                under: categoriesObject[item].id
            });
        });

        return [...array, ...newItems];
    }, []);


    const _conditions = conditions.reduce((array, {catalog, category, fields}) => {
        const newItems = [];

        fields.forEach((item) => {
            newItems.push({
                catalogId: catalogObject[catalog].id,
                categoryId: categoriesObject[category].id,
                catalogItemId: item
            });
        });

        return [...array, ...newItems];
    }, []);

    return Promise.all([
        knex.table('hierarchy').insert(hierItems),
        knex.table('collections').insert(
            collections.map(({brand, nameDealer, name, category, ...item}) => {
                return {
                    ...item,
                    name,
                    nameDealer: nameDealer || name,
                    categoryId: category && categoriesObject[category].id || null,
                    brandId: brandsObject[brand].id
                };
            })),
        knex.table('catalogItemsCategory').insert(_conditions)
    ]);
};

exports.down = (knex) => Promise.resolve();
