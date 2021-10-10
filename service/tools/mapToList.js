const {array2Object} = require('./array2Object');
const {entity} = require('../../enums');

const mapToList = ({products, category = {}, categoryHead = [], prices}) => {
    const pricesProducts = array2Object(prices.filter(({entity: priceEntity}) => priceEntity === entity.PRODUCT), 'entityId');
    const pricesCategory = array2Object(prices.filter(({entity: priceEntity}) => priceEntity === entity.CATEGORY), 'entityId');
    const categories = [...categoryHead, category]
        .map((category) => {
            return {...category, price: pricesCategory[category.id]};
        })
        .sort((a, b) => b.level - a.level);


    return products.map(({imgs, ...product}) => {
        product.price = pricesProducts[product.id];
        const img = imgs && (imgs.find(({isMain}) => isMain) || {}) || {};
        product.img = img.src ;
        product.isDoor = img.isDoor;
        product.imgForHover = imgs && (imgs.find(({isForHover}) => isForHover) || {}).src;

        return {
            ...product,
            ...getParamsOfProductOrCategory(product, categories,['price', 'desc', 'img'])
        };
    });

};

getParamsOfProductOrCategory = (product, categories, params) =>
    params.reduce((sum, param) => {
        return {...sum, [param] : getParamOfProductOrCategory(product, categories, param) };
    }, {});

getParamOfProductOrCategory = (product, categories, param) => product[param] || getParamOfCategory(categories, param);

getParamOfCategory = (categories, param) => (categories.find((category)=>category[param]) || {})[param];

module.exports = {
    mapToList
};
