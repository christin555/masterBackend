const axios = require("axios");
const cheerio = require('cheerio');
const {parseScript} = require("shift-parser");

module.exports = {
    parseUrls: async (urls) => {
        console.log('startParse Alsafloor, get link of products');

        const productUrls = new Set();
        const collectionsHtml = await Promise.all(urls.map((productLink) => axios.get(productLink)));

        collectionsHtml.filter(Boolean).forEach(({data: dataProduct}) => {
            if (dataProduct) {
                const $ = cheerio.load(dataProduct);

                $('[class="catalog-collection-item-title block-title"] a').each(function () {
                    productUrls.add($(this).attr('href').trim());
                });
            }
        });

        const productUrlsDomain = Array.from(productUrls).map((absPath) => `http://www.alsafloor.ru${absPath}`);

        return productUrlsDomain;
    }
};

