const axios = require("axios");
const cheerio = require('cheerio');
const {parseScript} = require("shift-parser");
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = {
    parse: async ({urls, problemCards}) => {
        const products = [];

        console.log('startParse Alpinefloor - 1, get link content');

        const productsHtml = await Promise.all(
            urls.map((productLink) => axios.get(productLink, {httpsAgent})
                .catch(function (error) {
                    console.log(error.toJSON());
                    problemCards.push(productLink);
                })));

        productsHtml.filter(Boolean).forEach(({data: dataProduct}) => {
            if (dataProduct) {
                const $ = cheerio.load(dataProduct);
                const imgs = [];
                const product = {};

                product.code = $('[class="item-detail-class__name"]').first().text().trim();

                if (!products.find(({code}) => code === product.code)) {
                    $('[data-fancybox="images"]').each(function () {
                        const src = $(this).attr('href');
                        imgs.push(src);
                    });

                    $('[class="h1 item-detail__header"]').each(function () {
                        let value = $(this).text().trim();

                        if (value.indexOf("ЕСО") > 0) {
                            value = value.substring(0, value.indexOf("ЕСО"));
                        }

                        if (value.indexOf("(без") > 0) {
                            value = value.substring(0, value.indexOf("(без"));
                        }
                        product.name = value;
                    });

                    $('[id="chars-table"] tr').each(function () {
                        const prop = $($(this).children()[0]).text().trim();
                        const val = $($(this).children()[1]).text().trim();
                        product[prop] = val;
                    });

                    product.collection = $('[class="list-box__link list-box__link_active"]').first().text().trim();
                    product._categoryType = 'кварцвинил';
                    product.imgs = imgs.map((link) => `https://alpinefloor.su${link}`);

                    if (product['Способ укладки'] === 'на клей к основанию пола') {
                        product.connectionType = 'Клеевой';
                    }
                    if (product['Способ укладки'] === 'Плавающий (click замок)') {
                        product.connectionType = 'Замковый';
                    }

                    products.push(product);
                }
            }
        });

        return products;
    }
};
