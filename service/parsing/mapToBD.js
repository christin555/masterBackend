const {array2Object} = require('../tools/array2Object');
const {categorySetFunc} = require('./categorySetFunc');

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

            categorySetFunc({itemBd, item, categoriesObject});

            item.imgs && imgs.push({name: itemBd.name, imgs: item.imgs});

            return itemBd;
        });

        return {readyToInsert, imgs};
    }
};

