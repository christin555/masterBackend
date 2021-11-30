const {parse} = require('node-html-parser');
const cheerio = require('cheerio');
const {ro} = require("faker/lib/locales");
const selectors = {
    link: 'a.js-product-link',
    code: '.item-detail-class__name',
    detailHead: 'h1.js-product-name',
    img: '.t-slds__bgimg',
    chars: '.t-descr_xs'
};

class Strategy {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    collectAllLinks(content) {
        const $ = parse(content);

        const collection = $.querySelectorAll(selectors.link);
        const links = new Set();

        collection.forEach((link) => {
            const {href} = link.attributes;

            links.add(href);
        });

        return links;
    }

    collectItem(content) {
        const html = cheerio.load(content);
        const resJSON = {};

        resJSON.images = this.collectImages(html);
        resJSON.name = this.collectDetail(html);

        Object.assign(resJSON, this.collectChars(html));

        resJSON._categoryType = 'ламинат';

        return resJSON;
    }

    collectImages($) {
        const images = [];

        $(selectors.img).each((_, img) => {
            const src = img.attribs['data-original'];

            images.push(src);
        });

        return images;
    }

    collectDetail($) {
        return $(selectors.detailHead).text().trim();
    }

    collectChars($) {
        const chars = {};
        const content = $(selectors.chars).contents().toArray();

        content.forEach((char, i) => {
            const row = $(char).text();

            if (row.indexOf(':') > 0) {
                const key = row.split(':')[0];
                const val = $(content[i + 1]).text().trim();

                if (key.includes('см')) {
                    chars[key] = parseFloat(val.replace(",", "."));
                } else if (key === 'Коллекция') {
                    chars.collection = val;
                } else chars[key] = val;
            }
        });

        return chars;
    }
}

module.exports = {Strategy};