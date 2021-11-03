const {array2Object} = require('../../service/tools/array2Object');
const {InsertImages} = require('./InsertImages');
const {translitRuEn} = require("../../service/tools/transliter");

class Insert {
    constructor({items, fields, collections, categories, knex, logger}) {
        this.fields = fields;
        this.items = items;
        this.knex = knex;
        this.logger = logger;

        this.collections = array2Object(collections, 'nameDealer', true);
        this.categories = array2Object(categories, 'alias');

        this.imageInsert = new InsertImages(knex, logger);
    }

    async insert() {
        this.prepareItems();

        const insertedProducts = await this.insertProducts();

        await this.imageInsert.insert(insertedProducts);
    }

    prepareItems() {
        this.readyItems = this.getUniqArray(this.items.map((item) => {
            const _item = this.createNewItemWithKeys(item);

            _item.collectionId = this.getCollection(item);
            _item.categoryId = this.getCategory(item);

            _item.alias = `${translitRuEn(item._categoryType)}_${translitRuEn(item.collection)}_${translitRuEn(_item.name)}`.toLowerCase();
            item.alias = _item.alias;

            this.imageInsert.fillImages(item);

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

        if (lowerCategory === 'кварцвинил' || lowerCategory === 'art vinyl') {
            const {connectionType} = item;
            const lowerConnection = connectionType?.toLowerCase();

            if (connectionType) {
                if (lowerConnection.includes('кле')) {
                    categoryId = this.categories['quartzvinyl_kleevay'].id;
                }

                if (lowerConnection.includes('замк')) {
                    categoryId = this.categories['quartzvinyl_zamkovay'].id;
                }
            }
        }

        return categoryId;
    }

    insertProducts() {
        this.logger.debug(`insert products(${this.readyItems.length})`);

        return this.knex('products')
            .insert(this.readyItems)
            .onConflict(['alias'])
            .merge()
            .returning(['alias', 'id']);
    }
}

module.exports = {Insert};
