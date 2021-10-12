const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const {parse} = require('node-html-parser');
const FileSystem = require('../../utils/FileSystem');
const LinksIterator = require('./LinksIterator');
const ReadIterator = require('./ReadIterator');

const baseUrl = 'http://www.alsafloor.ru/';

const urls = [
    '/collection/laminat-alsafloor-solid-medium',
    '/collection/laminat-alsafloor-solid-plus',
    '/collection/laminat-alsafloor-solid-chic',
    '/collection/laminat-alsafloor-creative-baton-rompu-herringbone',
    '/collection/laminat-alsafloor-osmoze',
    '/collection/laminat-alsafloor-osmoze-medium'
];

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

const url2path = (url) => {
    if (url[0] === '/') {
        return url.slice(1).replace(/\//g, '-');
    }

    return url.replace(/\//g, '-');
};

const getContent = async(url) => {
    const {data: content} = await axios.get(url);

    FileSystem.saveRaw('data/main.html', content);

    return FileSystem.load('data/main.html');
};

const collectLinks = async(url, content) => {
    const html = await cheerio.load(content);
    const collection = html(selectors.link);
    const links = new Set();

    await collection.each((_, elem) => {
        const {href} = elem.attribs;

        if (href) {
            links.add(href);
        }
    });

    return links;
};

const parseUrlLink = async(content) => {
    const $ = parse(content);
    const resJSON = {};

    resJSON.images = $.querySelectorAll(selectors.images).map((el) => el.attributes.src);

    const desc = [];

    $.querySelectorAll(selectors.itemDesc)
        .forEach((el) => {
            const key = el.querySelector(selectors.itemDescText).textContent.trim();
            const value = el.querySelector(selectors.itemDescValue).textContent.trim();

            desc.push({key, value});
        });

    $.querySelectorAll(selectors.additionalDesc)
        .forEach((el) => {
            const descStr = el.textContent;
            const [key, value] = descStr.split(':');

            if (!key) {
                desc.push({key: value, value});
            } else {
                desc.push({key, value});
            }

        });


    resJSON.desc = desc;
    resJSON.name = $.querySelector(selectors.name).textContent;

    return resJSON;
};

const parseUrlLinks = async(linksSet, v) => {
    const iterator = new LinksIterator(
        baseUrl,
        [...linksSet],
        {ms: 1000}
    );

    const pathed = url2path(v);

    FileSystem.mkdirP(path.join('data', pathed));

    for await (const {url, data} of iterator) {
        const j = url2path(url);
        const filename = path.join('data', pathed, `${j}.html`);

        FileSystem.saveRaw(filename, data);
    }
};

const readFromData = async() => {
    const dirs = urls.map(url => path.join('data', url2path(url)));
    const readIter = new ReadIterator(dirs);
    const promises = [];

    for await (const cont of readIter) {
        promises.push(parseUrlLink(cont));
    }

    const json = await Promise.all(promises);

    FileSystem.saveToJSON(path.join('data', 'all'), json)
};

const parseT = async() => {
    const productLinks = new Map();

    const iterator = new LinksIterator(
        baseUrl,
        urls,
        {ms: 1000}
    );

    // for await (const {url, data} of iterator) {
    //     const links = await collectLinks(url, data);
    //
    //     productLinks.set(url, links);
    // }
    //
    // productLinks.forEach(parseUrlLinks);

    await readFromData();
};

parseT();

