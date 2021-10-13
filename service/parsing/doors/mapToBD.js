const {array2Object} = require('../../tools/array2Object');

module.exports = {
    mapToBD: ({products, categories, fields, collections, finishingMaterials}) => {
        const collectionsObject = array2Object(collections, 'nameDealer');
        const finishingMaterialsObject = array2Object(finishingMaterials, 'name');
        const categoryId = categories.find(({alias}) => alias === 'doors').id;
        const imgs = [];

        const readyToInsert = products.map((item) => {
            const itemBd = {};
            Object.entries(item).forEach(([key, value]) => {
                const newKey = fields[key];
                if (newKey) {
                    itemBd[newKey] = value;
                }
            });

            itemBd.categoryId = categoryId;

            if (collectionsObject && item.collection && collectionsObject[item.collection]) {
                itemBd.collectionId = collectionsObject[item.collection].id;
            }

            if (item.finishingMaterial) {
                const finishingMaterial = [];
                item.finishingMaterial.map(({name}) => {
                    finishingMaterial.push(finishingMaterialsObject[name].id);
                });
                itemBd.finishingMaterial = finishingMaterial;

                imgs.push({name: itemBd.name, isDoor: true, imgs: item.finishingMaterial.map(({img}) => img)});
            }

            return itemBd;
        });

        return {readyToInsert, imgs};
    }
};

