'use strict';

exports.up = (knex) => Promise.all([
    knex.schema.createTable('categories', table => {
        table.increments('id')
            .primary();
        table.string('name')
            .notNullable();
        table.integer('level')
            .notNullable();
        table.string('alias')
            .notNullable()
            .unique();
        table.boolean('isLast');
        table.string('img');
        table.string('description');
        table.timestamp('deleted_at');
        table.timestamps();

        table.index('alias');
    }),

    knex.schema.createTable('products', table => {
        table.increments('id')
            .primary();
        table.integer('categoryId');
        table.string('name')
            .notNullable();
        table.text('description');
        table.string('resistanceClass');
        table.string('size');
        table.string('metersInPackage')
            .comment('М2 В УПАК');
        table.integer('collectionId');
        table
            .string('protectiveLayer')
            .comment('Защитный слой');
        table
            .string('fireClass')
            .comment('Класс пожарной опасности');
        table
            .string('householdGuarantee')
            .comment('Гарантия при бытовом применении');
        table
            .string('collection')
            .comment('Коллекция при занесении');
        table
            .string('totalThickness')
            .comment('Общая толщина');
        table
            .string('withHeatingFloor')
            .comment('Применение с подогревом полов');
        table
            .string('connectionType')
            .comment('Тип соединения');
        table
            .string('format')
            .comment('Формат');
        table
            .string('specials')
            .comment('Особенности');
        table
            .string('surfaceTexture')
            .comment('Текстура поверхности');
        table
            .string('soundproofing')
            .comment('Звукоизоляция');
        table
            .string('color')
            .comment('Цвет декора');
        table
            .string('code')
            .comment('Артикул');
        table
            .string('surface')
            .comment('Поверхность');
        table
            .string('texture')
            .comment('Фактура');
        table
            .string('tileType')
            .comment('Вид плитки');
        table
            .string('fixationType')
            .comment('Тип фиксации');
        table
            .string('thickness')
            .comment('Толщина плитки');
        table
            .string('chamfer')
            .comment('Фаска');
        table
            .string('itemsInPackage')
            .comment('Количество штук в упаковке');
        table
            .string('packageWeight')
            .comment('Вес 1 упаковки');
        table
            .string('guarantee')
            .comment('Гарантия');
        table
            .string('country')
            .comment('Страна производства');
        table
            .string('using')
            .comment('Применение');
        table
            .specificType('finishingMaterial', 'INT[]')
            .comment('Материал отделки(Только для дверей)');
        table
            .string('length');
        table
            .string('width');
        table
            .string('substrateThickness')
            .comment('Толщина подложки');
        table
            .string('height')
            .comment('Высота');
        table
            .string('isSimple')
            .comment('Нет подложки');
        table
            .string('link3d')
            .comment('фотографии яндекс диск');
        table
            .string('colorFamily')
            .comment('Семейство цветов');
        table
            .string('colorName')
            .comment('Название цвета');
        table
            .string('abrasionResistance')
            .comment('Сопротивление истираемости (AC)');
        table
            .string('baseBoard')
            .comment('Плотность плиты');
        table
            .string('constructionProcess')
            .comment('Способ производства');
        table
            .string('furnitureLegEffect')
            .comment('Устойчивость к воздействию ножек мебели и каблуко');
        table
            .string('professionalWarranty')
            .comment('Срок службы в общественных помещениях');
        table
            .string('residentialWarranty')
            .comment('Срок службы в жилых помещениях');

        table.timestamp('deleted_at', {useTz: false});
        table.timestamps();

        table.unique(['name', 'categoryId', 'collectionId', 'code']);
        table.index('id');
        table.index('categoryId');
    }),

    knex.schema.createTable('catalogs', table => {
        table.increments('id');
        table.string('title');
        table.string('name');
    }),

    knex.schema.createTable('brands', table => {
        table.increments('id');
        table.string('name');
        table.string('alias');
        table.integer('weight');

        table.unique(['name']);
    }),

    knex.schema.createTable('catalogItems', table => {
        table.increments('id');
        table.integer('catalogId');
        table.jsonb('item');
    }),

    knex.schema.createTable('collections', table => {
        table.increments('id');
        table.string('name')
            .comment('Название на нашем сайте')
            .notNullable();
        table.string('nameDealer')
            .notNullable();
        table.string('priceName')
            .comment('Название в прайсах');
        table.integer('brandId');
        table.integer('categoryId');
        table.timestamp('deleted_at');

        table.unique(['name', 'brandId']);
    }),

    knex.schema.createTable('prices', table => {
        table.integer('entity');
        table.integer('entityId')
            .notNullable();
        table.integer('price')
            .notNullable();
        table.integer('oldPrice');
        table.unique(['entity', 'entityId']);
    }),

    knex.schema.createTable('finishingMaterialDoors', table => {
        table.increments('id');
        table.string('name')
            .unique()
            .notNullable();
        table.string('img');
    }),

    knex.schema.createTable('articles', table => {
        table.increments('id');
        table.string('title');
        table.text('content');
    }),

    knex.schema.createTable('media', table => {
        table.integer('entity');
        table.integer('entityId')
            .notNullable();
        table.string('src', 500)
            .notNullable();
        table.string('type');
        table.boolean('isMain');
        table.boolean('isForHover');
        table.boolean('isDoor');
    }),

    knex.schema.createTable('hierarchy', table => {
        table.integer('head')
            .notNullable();
        table.integer('under')
            .notNullable()
            .unique();
    }),

    knex.schema.createTable('catalogItemsCategory', table => {
        table.integer('catalogId')
            .notNullable();
        table.integer('catalogItemId')
            .notNullable();
        table.integer('categoryId')
            .notNullable();
    }),

    knex.schema.createTable('actions', table => {
        table.increments('id')
            .primary();
        table.integer('entity')
            .notNullable();
        table.integer('entityId')
            .notNullable();
        table.string('title');
        table.string('desc');
        table.timestamp('deleted_at');
        table.timestamps();
        table.index('id');
    })
]);

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('categories'),
        knex.schema.dropTable('products'),
        knex.schema.dropTable('prices'),
        knex.schema.dropTable('hierarchy'),
        knex.schema.dropTable('actions'),
        knex.schema.dropTable('media'),
        knex.schema.dropTable('collections'),
        knex.schema.dropTable('catalogs'),
        knex.schema.dropTable('catalogItems'),
        knex.schema.dropTable('finishingMaterialDoors'),
        knex.schema.dropTable('brands'),
        knex.schema.dropTable('catalogItemsCategory'),
        knex.schema.dropTable('articles')
    ]);
};
