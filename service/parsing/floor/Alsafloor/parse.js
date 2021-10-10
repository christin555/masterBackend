const axios = require("axios");
const cheerio = require('cheerio');
const {parseScript} = require("shift-parser");

module.exports = {
    parse: async ({urls, problemCards}) => {
        const products = [];

        console.log('startParse Alsafloor - 1, get link content');

        const productsHtml = await Promise.all(
            urls.map((productLink) => axios.get(productLink)
                .catch(function (error) {
                    console.log(error.toJSON());
                    problemCards.push(productLink);
                })));

        productsHtml.filter(Boolean).forEach(({data: dataProduct}) => {
            if (dataProduct) {
                const $ = cheerio.load(dataProduct);
                const imgs = [];
                const chars = {};

                $('[class="block-picture"] img').each(function () {
                    const src = $(this).attr('src');
                    imgs.push(src);
                });

            }
        });

        return products;
    }
};
