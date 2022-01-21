const {BaseParser} = require('../BaseParser');
const {logger} = require('../utils');
const {Strategy} = require('./Strategy');
const {SaveProducts} = require('./save/SaveProducts');
const {finishing: finishingEnum} = require('../../enums');
const path = require("path");
const knex = require('../../knex');
const {ImageSaver} = require("../utils");
const baseUrl = 'https://www.syngy.ru/';

const urls = [
    '/catalog/seriya_khaytek/', 
    '/catalog/seriya_peskostruy/',
    '/catalog/seriya_neoklassika/',
    '/catalog/seriya_angliyskaya_klassika/',
    '/catalog/seriya_stil_loft/',
    '/catalog/detskaya_seriya/',
    '/catalog/fotopechat_tripleks/'
];

const start = async() => {
    console.log('start Synergi');

    try {
        const finishing = {};

        const parser = new BaseParser(
            baseUrl,
            urls,
            new Strategy(baseUrl, finishing),
            {ms: 500, msBetweenUrl: 250}
        );

        const products = await parser.parse();


        console.log(1)
        const saverImgs = new ImageSaver(logger, 100);
        const array = Object.values(finishing).map(({dataId, name, img}) => {

            const ext = path.extname(img);
            const pathimg = dataId + ext;

            return {
                dataId,
                name: name || null,
                src: `/static/images/finishing/${pathimg}`,
                url: `https://www.syngy.ru${img}`
            };
        });
        saverImgs.save(array);

        console.log(2);

        await knex('finishingMaterialDoors')
            .insert(array.map(({name, dataId, src}) => {
                return {
                    name,
                    img: src,
                    dataId,
                    type: name && finishingEnum.MATERIAL || finishingEnum.WINDOW
                };
            }))
            .onConflict(['name', 'dataId'])
            .merge();
            console.log(3)

        const saver = new SaveProducts(
            products,
            {knex, logger}
        );

        await saver.save();
    } catch(e) {
        console.log('Error when parse', e);
    } finally {
        await knex.destroy();
    }
};

module.exports = {
    start
};
