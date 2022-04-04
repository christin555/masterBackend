const {parse} = require('node-html-parser');
const cheerio = require('cheerio');
const selectors = {
    link: '.product-title a',
    detailHead: '.vm-products-title h2',
    img: '.product-slider img',
    chars: '.product-field-display',
    details: '.product-field',
    desc: '.content-block--text',
    blocks: '.content-block-item-content',
    code: '.goods-article'
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
        resJSON.code = this.collectCode(html);

        Object.assign(resJSON, this.collectChars(html));
        Object.assign(resJSON, this.collectDetails(html));

        resJSON.collection = html('input[type="radio"]:checked').first().val();

        resJSON._categoryType = 'probkovoe_pokrytie';

        if (resJSON['ТИП МОНТАЖА']?.toLowerCase().includes('кле')) {
            resJSON.connectionType = 'Клеевой';
        }

        if (resJSON['ТИП МОНТАЖА']?.toLowerCase().includes('зам')) {
            resJSON.connectionType = 'Замковый';
        }

        return resJSON;
    }

    collectCode($) {
        let _code;
        $(selectors.code).children().each((_, child) => {
            const code = $(child).text().trim();

            if (!_code && /\D/.test(code)) {
                _code = code;
            }
        });

        return _code;
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

    collectDetails($) {
        const chars = {};

        $(selectors.details).each((_, char) => {
            const field = $(char).children().first().children().first();

            const key = $(field).children().first().text();
            const value = $(field).children().last().text();

            chars[key] = value;
        });

        chars.chars = [];
        $(selectors.blocks).each((_, char) => {
            const field = $(char).children();

            const key = $(field).first().text().trim();
            const value = $(field).last().text().trim();

            chars.chars.push({key, value});
        });

        chars.description = $(selectors.desc).text().trim();

        chars.chars = JSON.stringify(chars.chars);

        return chars;
    }

    collectChars($) {
        const chars = {};

        $(selectors.chars).each((_, char) => {
            const field = $(char).children().first();

            const key = $(field).children().first().text();
            const value = $(field).children().last().text();

            chars[key] = value;
        });

        return chars;
    }
}

module.exports = {Strategy};
