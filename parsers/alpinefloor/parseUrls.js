const axios = require("axios");
const cheerio = require('cheerio');
const {parseScript} = require("shift-parser");
const https = require('https');

const agent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = {
    parseUrls: async (urls) => {
        console.log('startParse Alpinefloor, get link of products');

        const productUrls = new Set();
        const collectionsHtml = await Promise.all(
            urls.map((productLink) => axios.get(productLink, {httpsAgent: agent}))
        );

        collectionsHtml.filter(Boolean).forEach(({data: dataProduct}) => {
            if (dataProduct) {
                const $ = cheerio.load(dataProduct);

                $('[class="product-tile__hover-content"] a').each(function () {
                    productUrls.add($(this).attr('href').trim());
                });
            }
        });

        const productUrlsDomain = Array.from(productUrls).map((absPath) => `https://alpinefloor.su${absPath}`);

        return productUrlsDomain;
    }
};

