const {ImageSaver} = require("../parsers/utils");
const {logger} = require('../parsers/utils/Logger');
const path = require("path");
const crypto = require("crypto");
const {addCollection} = require("./tools/addCollectionsWithBrand");
const {finishing} = require('../enums');

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
    const saver = new ImageSaver(logger, 100);
    const array = items.map(({name, img}) => {
        const hash = crypto.createHash('md5').update(name);
        const ext = path.extname(img);
        const pathimg = hash.digest('hex') + ext;

        return {
            name,
            src: `/static/images/finishing/${pathimg}`,
            url: `https://www.syngy.ru${img}`
        };
    });


    return Promise.all([
        saver.save(array),
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
