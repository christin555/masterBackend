const {parse} = require('node-html-parser');

const selectors = {
    link: '.name-link',
    itemDesc: '.features-all li',
    itemValue: '.field-value',
    itemKey: '.field-label',
    name: 'h1.title'
};

class Strategy {
    collectAllLinks(content) {
        const html = parse(content);
        const collection = html.querySelectorAll(selectors.link);
        const links = new Set();

        collection.forEach((el) => {
            const {href} = el.attributes;

            if (href) {
                links.add(href);
            }
        });

        return links;
    };

    collectItem(content) {
        const html = parse(content);
        const descContent = html.querySelectorAll(selectors.itemDesc);
        const resJSON = {};
        const desc = [];

        resJSON.name = html.querySelector(selectors.name)?.textContent;

        descContent.forEach((el) => {
            const key = el.querySelector(selectors.itemKey).textContent;
            const value = el.querySelector(selectors.itemValue).textContent;

            desc.push({key, value});
        });

        resJSON.desc = desc;

        return resJSON;
    };
}

module.exports = {Strategy};