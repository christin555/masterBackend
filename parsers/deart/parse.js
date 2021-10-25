const axios = require("axios");
const cheerio = require('cheerio');
const {parseScript} = require("shift-parser");

module.exports = {
    parse: async ({urls, problemCards}) => {
        const products = [];

        console.log('startParse Deart - 1, get link content');

        const productsHtml = await Promise.all(
            urls.map((productLink) => axios.get(productLink)
                .catch(function (error) {
                    console.log(error.toJSON());
                    problemCards.push(productLink);
                })));

        productsHtml.filter(Boolean).forEach(({data: dataProduct}) => {
            if (dataProduct) {
                const $ = cheerio.load(dataProduct);
                const code = $('[class="breadcrumbs"] > span').text().trim();
                const imgs = [];
                const chars = {};

                $('a[data-fancybox="gallery"]').each(function () {
                    const href = $(this).attr('href');
                    imgs.push(`https://deartfloor.ru${href}`);
                });

                const keys = [];
                const values = [];
                
                $('[class="item-right-key"]').each(function () {
                    const prop = $(this).text().trim().replace(':', '');
                    keys.push(prop);
                });
                
                $('[class="item-right-value"]').each(function () {
                    const value = $(this).text().trim().replace(':', '');
                    values.push(value);
                });

                for(let i =0; i<keys.length; i ++) {
                    chars[keys[i]] = values[i];
                }
                
                const collection = $('[class="item-right-title"]:first').text().trim();

                products.push({
                    name: code,
                    code,
                    imgs,
                    collection,
                    ...chars,
                    _categoryType: 'кварцвинил',
                });
            }
        });

        return products;
    }
};
