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
        resJSON.desc = this.collectChars(html);

        resJSON.collection = html('[class="list-box__link list-box__link_active"]')
            .first()
            .text()
            .trim();

        resJSON.code = html(selectors.code)
            .first()
            .text()
            .trim();

        resJSON._categoryType = 'кварцвинил';

        if (resJSON['Способ укладки'] === 'на клей к основанию пола') {
            resJSON.connectionType = 'Клеевой';
        }
        if (resJSON['Способ укладки'] === 'Плавающий (click замок)') {
            resJSON.connectionType = 'Замковый';
        }

        return resJSON;
    }

    collectImages($) {
        const images = [];

        $(selectors.img).each((_, img) => {
            const src = img.attribs['data-src'];

            images.push(src);
        });

        return images;
    }

    collectDetail($) {
        let value = $(selectors.detailHead).text().trim();

        if (value.indexOf('ЕСО') > 0) {
            value = value.substring(0, value.indexOf('ЕСО'));
        }

        if (value.indexOf('(без') > 0) {
            value = value.substring(0, value.indexOf('(без'));
        }

        return value;
    }

    collectChars($) {
        const chars = [];

        $(selectors.chars).each((_, char) => {
            const key = $(char).children().first().text();
            const value = $(char).children().last().text();

            chars.push({key, value});
        });

        return chars;
    }
}

module.exports = {Strategy};