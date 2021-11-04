const {array2Object} = require('../../service/tools/array2Object');
const {entity} = require('../../enums');
const {ImageHashIterator} = require('./ImageIterator');
const {ImageSaver} = require('./ImageSaveIterator');

class InsertImages {
    constructor(knex, logger) {
        this.knex = knex;
        this.logger = logger;

        this.images = new ImageHashIterator();
        this.imageSaver = new ImageSaver(logger);
    }

    async insert(insertedProducts) {
        const {
            imagesToDownload,
            imagesToInsert
        } = this.prepareImages(insertedProducts);

        if (imagesToInsert.length) {
            await this.saveImagesToDB(imagesToInsert);
        }

        if (imagesToDownload.length) {
            await this.saveImagesToDisk(imagesToDownload);
        }

        await this.deleteFailed();
    }

    fillImages(item) {
        const {alias, images} = item;

        if (!alias || !images) {
            throw new Error(`name and images are required for fill`);
        }

        if (images) {
            this.images.push(alias, images);
        }
    }

    prepareImages(insertedProducts) {
        const obj = array2Object(insertedProducts, 'alias');

        const imagesToInsert = [];
        const imagesToDownload = [];

        const generator = this.generateImage(obj);

        for (const {alias, images} of this.images) {
            images.forEach(({path, url}, idx) => {
                const image = generator(alias, path, idx);

                imagesToInsert.push(image);

                imagesToDownload.push({
                    src: image.src,
                    url
                });
            });
        }

        return {imagesToInsert, imagesToDownload};
    }

    generateImage(obj) {
        return (name, path, idx) => {
            const img = {
                entity: entity.PRODUCT,
                entityId: obj[name].id,
                src: `/static/images/${String(entity.PRODUCT)}/${path}`
            };

            // TODO переделать в таблице на order
            if (idx === 0) {
                img.isMain = true;
            } else {
                img.isForHover = true;
            }

            return img;
        };
    }

    async saveImagesToDisk(imagesToDownload) {
        this.logger.debug('save images to disk');

        this.failed = await this.imageSaver.save(imagesToDownload);
    }

    deleteFailed() {
        this.logger.debug(`failed(${this.failed.length}) delete`);

        if (!this.failed.length) {
            return;
        }

        const f = this.failed.map((file) => `'%${file}'`);
        // Названия файлов генерируются на нашей стороне
        // поэтому можно не бояться инъекций
        const sql = `src like any (ARRAY[${f}])`;

        return this.knex('media')
            .whereRaw(sql)
            .delete();
    }

    saveImagesToDB(imagesToInsert) {
        this.logger.debug('insert images');

        return this.knex('media').insert(imagesToInsert);
    }
}

module.exports = {InsertImages};