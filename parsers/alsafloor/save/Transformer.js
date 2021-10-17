const {
    COLLECTION_IDX,
    CODE_IDX,
    collectionMatch,
    delProps,
    propsToDB,
    yesBool
} = require('./consts');


class Transformer {
    /**
     * @param {Object} products
     * @param {Object[]} products.alsafloor
     * @param {Object[]} products.edz
     */
    constructor(products) {
        this.products = products;
        this.final = {};
        this.objAlsafloor = {};
    }

    map() {
        this.products.alsafloor.forEach(this.mapAlsafloor);
        this.products.edz.forEach(this.mapEdz.bind(this));

        return Object.values(this.final);
    }

    mapAlsafloor(product) {
        const collection = product.desc[COLLECTION_IDX].value;
        const code = product.desc[CODE_IDX].value;

        if (collectionMatch[collection]) {
            product.collection = collectionMatch[collection];
        } else {
            product.collection = collection;
        }

        product.code = code;
    }

    mapEdz(product) {
        const mainName = this.fixMainName(product.name);

        const aPr = this.products.alsafloor.find(({name, collection, code}) => {
            return this.has(mainName, name) &&
                this.has(mainName, collection);
        });

        if (aPr !== undefined) {
            product.name = aPr.collection + ' ' + aPr.name;
            product.collection = aPr.collection;
            product.code = aPr.code;
            product.images = aPr.images;
            product.desc = product.desc.concat(aPr.desc)
                .filter(this.filterFinalDesc)
                .map(this.mapDescProps);

            this.final[mainName] = product;
        } else {
            console.log('missing product', mainName);
        }
    }

    filterFinalDesc({key}) {
        return !delProps[key];
    }

    mapDescProps(desc) {
        let key = propsToDB[desc.key];
        const value = desc.value;

        if (!key) {
            key = desc.key;
        }

        return {
            key,
            value
        };
    }

    has(s1, s2) {
        return s1.toLowerCase().indexOf(s2.toLowerCase()) > -1;
    }

    fixMainName(name) {
        let _name = name;

        if (this.has(name, 'Пралин')) {
            _name = name.replace('Пралин', 'Пролин');
        }

        if (this.has(name, 'Left')) {
            _name = name.replace('Left', '');
        }

        if (this.has(name, 'Right')) {
            _name = name.replace('Right', '');
        }

        return _name;
    }
}

module.exports = {Transformer};