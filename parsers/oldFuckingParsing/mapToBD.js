const {array2Object} = require('../../service/tools/array2Object');
const {categorySetFunc} = require('./categorySetFunc');
const {translitRuEn} = require("../../service/tools/transliter");

module.exports = {
    mapToBD: ({products, categories, fields, collections}) => {
        const collectionsObject = array2Object(collections, 'nameDealer', true);
        const categoriesObject = array2Object(categories, 'alias');
        const imgs = [];

        const readyToInsert = products.map((item) => {
            const itemBd = {};
            Object.entries(item).forEach(([key, value]) => {
                const newKey = fields[key];
                if (newKey) {
                    itemBd[newKey] = value;
                }
            });

            if (collectionsObject && item.collection && collectionsObject[item.collection.toLowerCase()]) {
                itemBd.collectionId = collectionsObject[item.collection.toLowerCase()].id;
            }

            itemBd.alias = `${translitRuEn(item._categoryType)}_${translitRuEn(item.collection)}_${translitRuEn(item.name)}_${translitRuEn(itemBd?.thickness || itemBd?.connectionType || '')}`.toLowerCase();
            item.alias = itemBd.alias;
            
            categorySetFunc({itemBd, item, categoriesObject});

            item.imgs && imgs.push({alias: itemBd.alias, imgs: item.imgs});

            return itemBd;
        });

        return {readyToInsert, imgs};
    }
};

