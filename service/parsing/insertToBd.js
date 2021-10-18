const {array2Object} = require('../tools/array2Object');
const {entity} = require('../../enums');
const {saveImg} = require('./saveImg');

module.exports = {
    insertToBd: async (knex, {readyToInsert, imgs}, prices) => {
        const products = await knex('products')
            .insert(readyToInsert)
            .onConflict(['name', 'categoryId', 'collectionId', 'code'])
            .merge()
            .returning(['id', 'name', 'code']);

        // const imgsObject = array2Object(imgs, 'name');
        //
        // const imgToInsert = products.reduce((array, {name, id}) => {
        //     const imgsProducts = imgsObject[name].imgs.map((img, index) => {
        //         return {
        //             entity: entity.PRODUCT,
        //             entityId: id,
        //             src: `${process.env.APP_HOST_URL}/public/imgs/original/${entity.PRODUCT}_${id}_${index}.jpg`,
        //             isDoor: imgsObject[name].isDoor,
        //             path: `public/imgs/original/${entity.PRODUCT}_${id}_${index}.jpg`,
        //             origSrc: img
        //         };
        //     });
        //
        //     imgsProducts[0].isMain = true;
        //     imgsProducts[1] && (imgsProducts[1].isForHover = true);
        //
        //     array.push(...imgsProducts);
        //
        //     return array;
        // }, []);
        //
        // Promise.all(imgToInsert.map(({path, origSrc}) => saveImg(origSrc, path)));

        //когда-нибудь переделай, пожалуйста, ну реально кровь из глаз идет аж...
        // await knex('media')
        //     .insert(
        //         imgToInsert.map(({entity, entityId, src, isDoor, isMain, isForHover}) => {
        //             return {entity, entityId, src, isDoor, isMain, isForHover};
        //         }));

        if (prices) {
            const pricesProducts = products.map(({id, code}) => {
                return {
                    entity: entity.PRODUCT,
                    entityId: id,
                    price: prices[code]
                };
            });

            await knex('prices')
                .insert(pricesProducts);
        }
        //  .onConflict(['name', 'categoryId'])
        //   .merge();
    }
};


