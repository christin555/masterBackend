const {parse} = require('node-html-parser');
const cheerio = require('cheerio');
const selectors = {
    link: '.tovar__top',
    img: '.gallery__item',
    chars: '.in-dio__item',
    collection: '.crumbs',
    ttl: '.ctr__pd > .ttl'
};
const iconv = require('iconv-lite');

class Strategy {
    constructor(baseUr, finishingl) {
        this.baseUrl = baseUr;
        this.finishing = finishingl;
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
        resJSON.collection = this.collectCollection(html);
        resJSON._categoryType = 'двери';
        resJSON.finishingMaterials = this.collectChars(html);

        this.collectFinishing(html);
        return resJSON;
    }

    collectFinishing($) {
        $(selectors.chars).each((_, color) => {
            const dataId = color.attribs['data-id'];
            const img = $($(color).find('img').first()).attr('src');
            const name = $(color).find('.color_name').text().trim();

            this.finishing[dataId] = {dataId, name, img};
        });
    }

    collectImages($) {
        const images = [];

        $(selectors.img).each((_, img) => {
            const src = img.attribs['href'];

            images.push(this.baseUrl + src);
        });

        return images;
    }

    collectDetail($) {
        return $(selectors.ttl).text().trim();
    }

    collectCollection($) {
        return $($(selectors.collection).children("a").last()).html().trim();

    }

    collectChars($) {
        const colors = [];

        $(selectors.chars).each((_, color) => {
            colors.push(color.attribs['data-id']);
        });

        return colors;
    }
}

module.exports = {Strategy};
