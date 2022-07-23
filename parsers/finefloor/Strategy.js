const {parse} = require('node-html-parser');
const cheerio = require('cheerio');
const selectors = {
    link: '.catalog__item a',
    code: '.item-detail-class__name',
    detailHead: '.main__container h1',
    img: '.catalog__image__slider__item',
    chars: '.specifications__table__row'
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
        resJSON.name = this.collectDetail(html);

        if (!resJSON.name) {
            return null;
        }

        resJSON.images = this.collectImages(html);

        resJSON.collection = this.collectCollection(html);

        Object.assign(resJSON, this.collectChars(html));

        resJSON._categoryType = 'кварцвинил';

        if (resJSON['Способ укладки']?.toLowerCase().includes('кле')) {
            resJSON.connectionType = 'Клеевой';
        } else {
            resJSON.connectionType = 'Замковый';
        }

        resJSON.code = html(selectors.code)
            .first()
            .text()
            .trim();


        return resJSON;
    }

    collectImages($) {
        const images = [];

        $(selectors.img).each((_, img) => {
            const src = img.attribs['style']?.replace("background-image: url(\'", "");

            images.push(this.baseUrl + src);
        });

        return images;
    }

    collectCollection($) {
        const collection = $('[class="breadcrumbs__item breadcrumbs__item--active"]')
            .first()
            .text()
            .trim();

        if (collection.toLowerCase().includes('gear')) {
            return 'Gear';
        } else if (collection.toLowerCase().includes('wood')) {
            return 'Wood';
        } else if (collection.toLowerCase().includes('stone')) {
            return 'Stone';
        } else return null;
    }

    collectDetail($) {
        return $(selectors.detailHead).text().trim();
    }

    collectChars($) {
        const chars = {};

        $(selectors.chars).each((_, char) => {
            const key = $(char).children().first().text().trim().replace(':', '');
            const value = $(char).children().last().text().trim();

            chars[key] = value;
        });

        return chars;
    }
}

module.exports = {Strategy};
