const {getCategories} = require('../../oldFuckingParsing/getCategories');
const {getCollections} = require('../../oldFuckingParsing/getCollections');
const {array2Object} = require('../../../service/tools/array2Object');
const {entity} = require('../../../enums');
const {Insert} = require("../../utils");
const {fields} = require("./consts");

const collectionMatch = {
    'Herringbone': 'Creative Baton Rompu/Herringbone'
};

class SaveProducts {
    /**
     * @param {Object[]} products
     * @param {Knex} knex
     * @param {Object} logger
     */
    constructor(products, knex, logger) {
        this.products = products;
        this.knex = knex;
        this.logger = logger;
    }

    async save() {
        // Инициализируем основные данные
        await this.init();

        this.inserter = new Insert({
            items: this.products,
            collections: [],
            categories: [],
            fields,
            logger: this.logger,
            knex: this.knex
        });

        await this.saveProducts();

        const {
            imagesToDownload,
            imagesToInsert
        } = this.inserter.prepareImages(this.insertedData);

        await this.inserter.saveImagesToDB(imagesToInsert);
        await this.inserter.saveImagesToDisk(imagesToDownload);

        if (this.inserter.failed?.length) {
            await this.inserter.deleteFailed();
        }

        this.logger.debug('work is canceled');
    }

    async init() {
        await Promise.all([
            this.getCategories(),
            this.getCollections()
        ]);
    }

    async getCategories() {
        this.categories = await getCategories({knex: this.knex});

        this.logger.debug('init categories');
    }

    async getCollections() {
        this.collections = await getCollections({
            knex: this.knex,
            brand: 'alsafloor',
            fields: ['collections.name', 'collections.id']
        });

        this.collections = array2Object(this.collections, 'name');

        this.logger.debug('init collections');
    }

    async saveImages() {
        const toInsert = this.insertedData.flatMap(({name, id}) => {
            return this.productsImages[name].map((src, idx) => ({
                entity: entity.PRODUCT,
                entityId: id,
                src: src,
                // Первая картинка главная по умолчанию
                isMain: idx === 0 ? true : undefined
            }));
        });

        this.logger.debug('prepare images');
        await this.knex('media').insert(toInsert);
        this.logger.debug('finish media insert');
    }

    async saveProducts() {
        this.prepareProducts();
        this.logger.debug('finish prepare');
        this.insertedData = await this.knex('products')
            .insert(this.products)
            .returning(['id', 'name', 'code']);
        this.logger.debug('finish insert');
    }

    prepareProducts() {
        const categoryId = this.categories
            .find(({alias}) => alias === 'laminate').id;

        this.productsImages = {};

        this.products.forEach((item) => {
            const {
                id: collectionId,
                name: collectionName
            } = this.findCollectionFromDB(item);

            Object.assign(item, this.descToObject(item));

            item.categoryId = categoryId;
            item.collectionId = collectionId;
            item.collection = collectionName;

            this.inserter.fillImages(item);

            // Удаляем ненужные данные для инсерта
            delete item.images;
            delete item.desc;
            delete item.code;
        });
    }

    descToObject(item) {
        const obj = {};

        item.desc.forEach(({key, value}) => {
            obj[key] = value;
        });

        return obj;
    }

    findCollectionFromDB(item) {
        const {collection} = item;
        const matched = collectionMatch[collection];

        if (matched) {
            return this.collections[matched];
        }

        return this.collections[collection];
    }
}

module.exports = {SaveProducts};