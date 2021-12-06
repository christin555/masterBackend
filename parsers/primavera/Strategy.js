const {parse} = require('node-html-parser');
const cheerio = require('cheerio');
const selectors = {
    link: '.search_item_text a',
    code: '.item-detail-class__name',
    detailHead: '.breadcrumb_title',
    img: '.slider-nav__link img',
    chars: '.catalog_detail_parametrs_table tr'
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

        resJSON.collection = html('[class="list-box__link list-box__link_active"]')
            .first()
            .text()
            .trim();

        if(resJSON.collection === 'Сопутствующие товары'){
            return null;
        }

        resJSON._categoryType = 'керамогранит';

        return resJSON;
    }

    collectImages($) {
        const images = [];

        $(selectors.img).each((_, img) => {
            const src = img.attribs['src'];

            images.push(this.baseUrl + src);
        });

        return images;
    }

    collectDetail($) {
        return $(selectors.detailHead).text().trim();
    }

    collectChars($) {
        const chars = {};

        $(selectors.chars).each((_, char) => {
            const key = $(char).children().first().text().trim();
            const value = $(char).children().last().text().trim();

            chars[key] = value;
        });

        return chars;
    }
}

module.exports = {Strategy};
