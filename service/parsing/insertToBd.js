const {array2Object} = require('../tools/array2Object');
const {entity} = require('../../enums');


module.exports = {
    insertToBd: async (knex, {readyToInsert, imgs}, prices) => {
        console.log(readyToInsert);
        const products = await knex('products')
            .insert(readyToInsert)
            .onConflict(['name', 'categoryId', 'collectionId', 'code'])
            .merge()
            .returning(['id', 'name', 'code']);

        const imgsObject = array2Object(imgs, 'name');;

        const imgToInsert = products.reduce((array, {name, id}) => {
            const imgsProducts = imgsObject[name].imgs.map((img) => {
                return {
                    entity: entity.PRODUCT,
                    entityId: id,
                    src: img,
                    isDoor: imgsObject[name].isDoor
                };
            });
            
            imgsProducts[0].isMain = true;
            imgsProducts[1] && (imgsProducts[1].isForHover = true);

            array.push(...imgsProducts);

            return array;
        }, []);

        await knex('media')
            .insert(imgToInsert);


        if(prices){
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


