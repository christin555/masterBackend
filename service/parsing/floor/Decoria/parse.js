const axios = require("axios");
const cheerio = require('cheerio');

module.exports = {
    parse: async ({urls, problemCards}) => {
        const products = [];

        console.log('startParse Decorica - 1, get link content');

        const productsHtml = await Promise.all(
            urls.map((productLink) => axios.get(productLink)
                .catch(function (error) {
                    console.log(error.toJSON());
                    problemCards.push(productLink);
                })));


        console.log('startParse Decorica - 2, get data');


        productsHtml.filter(Boolean).forEach(({data: dataProduct}) => {
            if (dataProduct) {
                // console.log(dataProduct);
                const p = cheerio.load(dataProduct);
                const name = p('h1[itemprop="name"]:first').text().trim();
                const artic = p('[itemprop="sku"]:first').text().trim();
                const chars = [];
                const imgs = [];

                const blockChars = p('div[class="js-store-prod-all-text"]:first');

                blockChars.find('li').each(function () {
                    const text = p(this).text().trim();
                    let props, val;

                    if (text.includes('Гарантия')) {
                        prop = "Гарантия";
                        val = text.substring(text.indexOf(" ") + 1).trim();
                    } else {
                        prop = text.substring(0, text.indexOf(":")).trim();
                        val = text.substring(text.indexOf(":") + 2).trim();
                    }
                    chars.push({[prop]: val});
                });

                const ar = blockChars.text().trim().split('Применение: ');
                ar[1] && chars.push({'Применение': ar[1]});


                p('script').each(function () {
                    const t = p(p(this).get()[0].children[0]).text();
                    if (t.includes('var product')) {
                        const y = findTextAndReturnRemainder(t, '"gallery":', ']');
                        const part = JSON.parse(y);

                        part.forEach(({img})=>imgs.push(img));
                    }
                }
                );


                products.push({
                    name,
                    artic,
                    imgs,
                    _categoryType: 'кварцвинил',
                    ...getProperites(chars)
                });
            }
        });

        return products; }
};

const getProperites = (array) => array.reduce((object, item) => {
    return {...object, ...item};
}, {});

function findTextAndReturnRemainder(target, variable, endSymbol) {
    const chopFront = target.substring(target.search(variable) + variable.length, target.length);
    const result = chopFront.substring(0, chopFront.search(endSymbol)+1);
    return result;
}
