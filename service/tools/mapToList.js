const mapToList = ({products}) => products.map(({imgs, ...product}) => {
    const img = imgs && (imgs.find(({isMain}) => isMain) || {}) || {};
    product.img = img.src;
    product.isDoor = img.isDoor;

    return product;
});

module.exports = {
    mapToList
};
