const {array2Object} = require('../../service/tools/array2Object');
const {ImageHashIterator} = require('./ImageIterator');
const {entity} = require('../../enums');
const {ImageSaver} = require('./ImageSaveIterator');
const pp = require('path');

class Insert {
    constructor({items, fields, collections, categories, knex, logger}) {
        this.fields = fields;
        this.items = items;
        this.categories = array2Object(categories, 'alias');
        this.collections = array2Object(collections, 'nameDealer', true);
        this.knex = knex;
        this.logger = logger;

        this.imageIter = new ImageHashIterator('https://google.com');
        this.imageSaver = new ImageSaver();

        this.images = {};
        this.imagesForDownload = [];
    }

    async insert() {
        this.prepareItems();

        await this.insertProducts();

        this.imageIter.setImages(this.images);

        const obj = array2Object(this.insertedProducts, 'name');

        const imgsToInsert = [];
        const imgsToDownload = [];

        for (const {name, images} of this.imageIter) {
            images.forEach(({path, url}, idx) => {
                const src = pp.join('static', 'images', String(entity.PRODUCT), path);
                const img = {
                    entity: entity.PRODUCT,
                    entityId: obj[name].id,
                    src
                };

                if (idx === 0) {
                    img.isMain = true;
                }

                if (idx === 1) {
                    img.isForHover = true;
                }

                imgsToInsert.push(img);
                imgsToDownload.push({
                    src,
                    url
                });
            });
        }

        await this.knex('media').insert(imgsToInsert);

        this.imageSaver.setImages(imgsToDownload);
        this.imageSaver.save();
    }

    prepareItems() {
        this.readyItems = this.items.map((item) => {
            const _item = this.createNewItemWithKeys(item);

            _item.collectionId = this.getCollection(item);
            _item.categoryId = this.getCategory(item);

            this.fillImages(item);

            return _item;
        });
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
        const lowerCategory = item._categoryType.toLowerCase();
        let categoryId;

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
        const {name, imgs} = item;

        if (item.imgs) {
            this.images[name] = imgs;
            this.imagesForDownload.push(...imgs);
        }
    }

    prepareImages() {

    }

    async insertProducts() {
        this.insertedProducts = await this.knex('products')
            .insert(this.readyItems)
            .onConflict(['name', 'categoryId', 'collectionId', 'code'])
            .merge()
            .returning(['id', 'name', 'code']);
    }
}

module.exports = {Insert};