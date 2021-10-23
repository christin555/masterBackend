const {array2Object} = require('../../service/tools/array2Object');
const {ImageHashIterator} = require('./ImageIterator');
const {entity} = require('../../enums');
const {ImageSaver} = require('./ImageSaveIterator');

class Insert {
    constructor({items, fields, collections, categories, knex, logger}) {
        this.fields = fields;
        this.items = items;
        this.knex = knex;
        this.logger = logger;

        this.collections = array2Object(collections, 'nameDealer', true);
        this.categories = array2Object(categories, 'alias');

        this.images = new ImageHashIterator();
        this.imageSaver = new ImageSaver(logger);
    }

    async insert() {
        this.prepareItems();

        const insertedProducts = await this.insertProducts();

        const {
            imagesToDownload,
            imagesToInsert
        } = this.prepareImages(insertedProducts);

        await this.saveImagesToDB(imagesToInsert);
        await this.saveImagesToDisk(imagesToDownload);

        if (this.failed?.length) {
            await this.deleteFailed();
        }
    }

    prepareItems() {
        this.readyItems = this.getUniqArray(this.items.map((item) => {
            const _item = this.createNewItemWithKeys(item);

            _item.collectionId = this.getCollection(item);
            _item.categoryId = this.getCategory(item);

            this.fillImages(item);

            return _item;
        }));
    }

    getUniqArray(_items) {
        const items = _items.filter(Boolean);
        const uniqObjectItems = {};

        items.forEach((item) => {
            const key = [item.name, item.collectionId, item.categoryId, item.code].join();
            uniqObjectItems[key] = item;
        });

        return Object.values(uniqObjectItems);
    }

    createNewItemWithKeys(item) {
        const _item = {};

        Object.entries(item).forEach(([key, val]) => {
            if (this.fields[key]) {
                _item[this.fields[key]] = val;
            }
        });

        return _item;
    };

    getCollection(item) {
        const lowerCollection = item.collection?.toLowerCase();

        if (!this.collections[lowerCollection]) {
            return;
        }

        return this.collections[lowerCollection].id;
    }

    getCategory(item) {
        const lowerCategory = item._categoryType?.toLowerCase();
        let categoryId;

        if (lowerCategory === 'спортивные напольные покрытия') {
            categoryId = this.categories['sport'].id;
        }

        if (lowerCategory === 'ламинат') {
            categoryId = this.categories['laminate'].id;
        }

        if (lowerCategory === 'кварцвинил') {
            const {connectionType} = item;
            const lowerConnection = connectionType?.toLowerCase();

            if (connectionType) {
                if (lowerConnection.includes('клеев')) {
                    categoryId = this.categories['quartzvinyl_kleevay'].id;
                }

                if (lowerConnection.includes('замков')) {
                    categoryId = this.categories['quartzvinyl_zamkovay'].id;
                }
            }
        }

        return categoryId;
    }

    fillImages(item) {
        const {name, images} = item;

        if (images) {
            this.images.push(name, images);
        }
    }

    prepareImages(insertedProducts) {
        const obj = array2Object(insertedProducts, 'name');

        const imagesToInsert = [];
        const imagesToDownload = [];

        const generator = this.generateImage(obj);

        for (const {name, images} of this.images) {
            images.forEach(({path, url}, idx) => {
                const image = generator(name, path, idx);

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
                src: `static/images/${String(entity.PRODUCT)}/${path}`
            };

            if (idx === 0) {
                img.isMain = true;
            }

            return img;
        };
    }

    insertProducts() {
        this.logger.debug(`insert products(${this.readyItems.length})`);

        return this.knex('products')
            .insert(this.readyItems)
            .onConflict(['name', 'categoryId', 'collectionId', 'code'])
            .merge()
            .returning(['id', 'name', 'code']);
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

module.exports = {Insert};