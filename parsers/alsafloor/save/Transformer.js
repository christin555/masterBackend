const {
    COLLECTION_IDX,
    CODE_IDX,
    collectionMatch,
    delProps,
    propsToDB
} = require('./consts');
const {Utils} = require('../../utils');


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
        this.products.alsafloor.forEach(this.mapAlsafloor.bind(this));

        return Object.values(this.final);
    }

    mapAlsafloor(product) {
        let collection = product.desc[COLLECTION_IDX].value;
        const code = product.desc[CODE_IDX].value;

        if (collectionMatch[collection]) {
            collection = collectionMatch[collection];
        }

        const ePr = this.products.edz.find(({name}) => {
            const mainName = this.fixMainName(name);

            return Utils.matchStr(mainName, product.name) &&
                Utils.matchStr(mainName, collection);
        }) || {};

        const name = collection + ' ' + product.name;

        if (ePr.desc) {
            product.desc = product.desc.concat(ePr.desc);
        }

        const desc = product.desc
            .filter(this.filterFinalDesc)
            .map(this.mapDescProps);

        this.final[name] = {
            images: product.images,
            collection,
            code,
            name: product.name,
            desc
        };

        if (!Object.values(ePr).length) {
            console.log('missing product in edz', name);
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

    fixMainName(name) {
        let _name = name;

        if (Utils.matchStr(name, 'Пралин')) {
            _name = name.replace('Пралин', 'Пролин');
        }

        if (Utils.matchStr(name, 'Left')) {
            _name = name.replace('Left', '');
        }

        if (Utils.matchStr(name, 'Right')) {
            _name = name.replace('Right', '');
        }

        return _name;
    }
}

module.exports = {Transformer};