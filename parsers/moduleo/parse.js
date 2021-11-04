const axios = require("axios");
const cheerio = require('cheerio');

module.exports = {
    parse: async ({ URL,problemCards }) => {
        const productLinks = [];
        const { data } = await axios.get(URL);
        const $ = cheerio.load(data);
        const products = [];

        console.log('startModuleo - 1, get all link cards');

        $('.c-card__btn a').each(function () {
            productLinks.push(encodeURI(decodeURI(`https://www.moduleo.com${$(this).attr('href')}`)));
        });

        console.log('startModuleo - 2, get cards');

        const productsHtml = await Promise.all(productLinks.map((productLink) => axios.get(productLink).catch(function (error) {
            console.log(error.toJSON());
            problemCards.push(productLink);
        })));

        console.log('startModuleo - 3, get data');

        productsHtml.filter(Boolean).forEach(({ data: dataProduct }) => {
            if (dataProduct) {
                const p = cheerio.load(dataProduct);
                const name = p('h1[data-webid="product-name"]:first').text().trim();
                const collection = p('h5[data-webid="product-collection"]:first').text().trim();
                const description = p('div[data-webid="product-description"]:first').text().trim();
                const chars = [];
                const imgs = [];
                const available = {};

                p('[data-webid="technical-property"]').each(function () {
                    const prop = p(p(this).children()[0]).text().trim();
                    const val = p(p(this).children()[1]).text().trim();
                    chars.push({ [prop]: val });
                });

                p('[data-webid="thumbnails-container"]').each(function () {
                    (p(this).find('img')).each(function () {
                        let img = encodeURI(decodeURI(p(this).attr('data-desktop-src')));
                        img = img.substring(0,img.indexOf("mw")) + 'mw=722';
                        imgs.push(img);
                    });
                });


                p('[data-webid="available-in"]').each(function () {
                    let name = p(p(this).children()).find('[data-webid="available-in-title"]:first').text().trim();
                    name = name.substring(name.indexOf(":") + 2);
                    available[name] = [];

                    p('[data-webid="available-in-property"]').each(function () {
                        let prop = p(p(this).children()[0]).text().trim();
                        prop = prop.substring(0,prop.indexOf(":"));

                        const val = p(p(this).children()[1]).text().trim();
                        available[name].push({ [prop]: val });
                    });
                });


                Object.keys(available).forEach((key) => {
                    products.push({
                        name,
                        collection,
                        description,
                        ...getProperites(chars),
                        imgs,
                        _categoryType: 'кварцвинил',
                        'Тип': key,
                        ...getProperites(available[key])
                    });
                });
            }
        });

        return products;
    }
};

const getProperites = (array) => array.reduce((object,item) => {
    return { ...object,...item };
},{});
