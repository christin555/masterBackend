const {parse} = require('node-html-parser');

const selectors = {
    link: 'a.catalog-collection-item-link',
    imagesLink: 'a.catalog-images-item-link',
    images: 'img.catalog-images-item-img',
    itemDescText: '.item-desc-text',
    itemDescValue: '.item-desc-value',
    name: 'h1.block-title',
    itemDesc: '.block-title ~ .block-content .item-desc-row',
    additionalDesc: '#goods-tab-2 ul li'
};

class Strategy {
    constructor(selectors) {
        this.selectors = selectors;
    }

    collectAllLinks(content) {
        const $ = parse(content);
        const collection = $.querySelectorAll(selectors.link);
        const links = new Set();

        collection.forEach((el) => {
            const {href} = el.attributes;

            if (href) {
                links.add(href);
            }
        });

        return links;
    }

    collectItem(content) {
        const $ = parse(content);
        const resJSON = {};
        const desc = [];

        resJSON.images = $.querySelectorAll(selectors.imagesLink)
            .map((el) => el.attributes.href);

        $.querySelectorAll(selectors.itemDesc)
            .forEach((el) => {
                const key = this.elText(selectors.itemDescText, el);
                const value = this.elText(selectors.itemDescValue, el);

                desc.push({key, value});
            });

        $.querySelectorAll(selectors.additionalDesc)
            .forEach((el) => {
                const descStr = this.toText(el);
                const [key, value] = descStr.split(':');

                if (!key) {
                    desc.push({key: value, value});
                } else {
                    desc.push({key: key.trim(), value});
                }
            });


        resJSON.desc = desc;
        resJSON.name = this.elText(selectors.name, $);

        return resJSON;
    }

    elText(sel, el) {
        return this.toText(el.querySelector(sel));
    }

    toText(el) {
        return el?.textContent
            .trim()
            .replace(';', '');
    }
}

module.exports = {Strategy};
