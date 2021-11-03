const {parse} = require('node-html-parser');
const cheerio = require('cheerio');
const selectors = {
    link: '.product-tile__hover-content a',
    code: '.item-detail-class__name',
    detailHead: 'h1.item-detail__header',
    img: '[data-fancybox="images"] img',
    chars: '.table-row'
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

        if (resJSON.name.indexOf('(без') > 0) {
            return null;
        }

        Object.assign(resJSON, this.collectChars(html));

        resJSON.collection = html('[class="list-box__link list-box__link_active"]')
            .first()
            .text()
            .trim();

        if(resJSON.collection === 'Сопутствующие товары'){
            return null;
        }

        resJSON.code = html(selectors.code)
            .first()
            .text()
            .trim();

        resJSON._categoryType = 'кварцвинил';

        if (resJSON['Способ укладки']?.toLowerCase().includes('клей')){
            resJSON.connectionType = 'Клеевой';
        }
        if (resJSON['Способ укладки']?.toLowerCase().includes('замок')) {
            resJSON.connectionType = 'Замковый';
        }

        return resJSON;
    }

    collectImages($) {
        const images = [];

        $(selectors.img).each((_, img) => {
            const src = img.attribs['data-src'];

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
            const key = $(char).children().first().text();
            const value = $(char).children().last().text();

            chars[key] = value;
        });

        return chars;
    }
}

module.exports = {Strategy};