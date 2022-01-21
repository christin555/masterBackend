const {addCollection} = require("./tools/addCollectionsWithBrand");

const coll = [
    'Хайтек',
    'Неоклассика',
    'Английская классика',
    'Лофт',
    'Пескоструй',
    'Двери для детской комнаты',
    'Двери с фотопечатью'
];
const brand = {
    name: 'Synergy',
    alias: 'synergi'
};


exports.up = async function (knex) {
    return Promise.all([
        addCollection(knex, brand, coll),
        knex.schema.alterTable('brands', (table) => {
            table.integer('categoryId')
                .nullable();
        }),
        knex.schema.alterTable('finishingMaterialDoors', (table) => {
            table.integer('type')
                .nullable();
            table.string('dataId')
                .nullable();
            table.string('name')
                .nullable().alter();
            table.integer('brandId')
                .nullable();
        })
    ]);
};

exports.down = function (knex) {
    return Promise.all([
        knex.schema.alterTable('finishingMaterialDoors', (table) => {
            table.dropColumns(['type', 'dataId', 'brandId']);
        }),
        knex.schema.alterTable('brands', (table) => {
            table.dropColumns(['categoryId']);
        })
    ]);
};
