const {array2Object} = require('../../service/tools/array2Object');
const {entity} = require('../../enums');
const crypto = require("crypto");
const path = require("path");
const {ImageSaver} = require('../utils/ImageSaveIterator');
const {logger} = require('../utils/Logger');

module.exports = {
    imagesWorker: async ({knex, products, imgs}) => {
        const imgsObject = array2Object(imgs, 'alias');
        const imgToInsert = [];
        const imagesToDownload = [];

        products.forEach(({alias}) => {
            const imgsProducts = imgsObject[alias].imgs.map((url, index) => {

                // const hash = crypto.createHash('md5').update(url);
                const ext = path.extname(url);
                // const pathimg = hash.digest('hex') + ext;
                const pathimg = alias + ext;
                const src = `/static/images/${String(entity.PRODUCT)}/${pathimg}`;

                imagesToDownload.push({
                    src: src,
                    url
                });

                return {
                    entity: entity.PRODUCT,
                    entityId: id,
                    src: src,
                    isDoor: imgsObject[name].isDoor
                };
            });

            imgsProducts[0].isMain = true;

            imgToInsert.push(...imgsProducts);

        });

        await knex('media').insert(imgToInsert);
        const imageSaver = new ImageSaver(logger);

        const failed = await imageSaver.save(imagesToDownload);

        if(failed.length){
            const f = failed.map((file) => `'%${file}'`);
            // Названия файлов генерируются на нашей стороне
            // поэтому можно не бояться инъекций
            // как скажешь
            const sql = `src like any (ARRAY[${f}])`;

            await knex('media')
                .whereRaw(sql)
                .delete();
        }
    }
};
