const axios = require("axios");
const cheerio = require('cheerio');
const {parseScript} = require("shift-parser");

module.exports = {
    parseUrls: async (urls) => {
        console.log('startParse Deart, get link of product');

        const productUrls = new Set();
        const collectionsHtml = await Promise.all(urls.map((productLink) => axios.get(productLink)));

        collectionsHtml.filter(Boolean).forEach(({data: dataProduct}) => {
            if (dataProduct) {
                const $ = cheerio.load(dataProduct);

                $('[class="catalog-inner"] a').each(function () {
                    productUrls.add($(this).attr('href').trim());
                });
            }
        });

        const productUrlsDomain = Array.from(productUrls).map((absPath) => `https://deartfloor.ru${absPath}`);

        return productUrlsDomain;
    }
};

