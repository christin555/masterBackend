const {getCategories} = require('../../utils/getCategories');
const {getCollections} = require('../../utils/getCollections');
const {array2Object} = require('../../../service/tools/array2Object');
const {InsertImages} = require('../../utils');
const {translitRuEn} = require("../../../service/tools/transliter");

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

        this.insertImages = new InsertImages(knex, logger);
    }

    async save() {
        // Инициализируем основные данные
        await this.init();
        await this.saveProducts();

        await this.insertImages.insert(this.insertedData);
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

    async saveProducts() {
        this.prepareProducts();
        this.logger.debug('finish prepare');
        this.insertedData = await this.knex('products')
            .insert(this.products)
            .onConflict(['alias'])
            .merge()
            .returning(['alias', 'id']);
        this.logger.debug('finish insert');
    }

    prepareProducts() {
        const categoryId = this.categories
            .find(({alias}) => alias === 'laminate').id;

        this.products.forEach((item) => {
            const {
                id: collectionId,
                name: collectionName
            } = this.findCollectionFromDB(item);


            Object.assign(item, this.descToObject(item));

            item.categoryId = categoryId;
            item.collectionId = collectionId;
            item.collection = collectionName;
            item.alias = `laminate_${translitRuEn(item?.collection || '')}_${translitRuEn(item?.name || '')}`.toLowerCase();

            this.insertImages.fillImages(item);

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
