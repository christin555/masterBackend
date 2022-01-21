const axios = require("axios");
const cheerio = require('cheerio');

const domain = 'http://www.optimaporte.ru';

module.exports = {
    parse: async ({URL, problemCards}) => {
        const productLinks = [];
        const {data} = await axios.get(URL);
        const $ = cheerio.load(data);
        const products = [];

        console.log('start Optima parse - 1, get all link cards');

        $('.item').each(function () {
            const _url = $(this).find('a').attr('href');
            productLinks.push(encodeURI(decodeURI(`${domain}${_url}`)));
        });

        console.log('start Optima parse - 2, get cards');

        const productsHtml = await Promise.all(productLinks.map((productLink) => axios.get(productLink).catch(function (error) {
            console.log(error.toJSON());
            problemCards.push(productLink);
        })));

        console.log('start Optima parse - 3, get data');

        for (const {data: dataProduct} of productsHtml.filter(Boolean)) {
            if (dataProduct) {
                console.log(1);
                const $ = cheerio.load(dataProduct);
                const name = $('[class="door-name"]:first').text().trim();
                const content = $('[class="content"] > p').text().trim();

                const codeModel = $('[class~="otdelka"] > div:first').attr('data-model-code');
                const codeFinishingMaterial= {};
                const codeGlazing = [];

                $('[class~="otdelka"] > div').each(function () {
                    const code = $(this).attr('data-otdelka-code');
                    const name = $(this).find('[class="item-name"]').text().trim();

                    codeFinishingMaterial[code] = name;
                });

                $('[class~="variant"] > div').each(function () {
                    const name = $(this).find('[class="item-name"]').text().trim();

                    codeGlazing.push(name);
                });
                console.log(2);
                const variants = await getVariant(Object.keys(codeFinishingMaterial), codeModel);
                const namesFinishingMaterial = Object.values(codeFinishingMaterial);
                const imgsAll = variants.map(({data: {html}}, index) => {
                    const imgs = getImgs(html);

                    return {
                        finishingMaterial: namesFinishingMaterial[index],
                        imgs
                    };
                });

                console.log(3);

                const newProducts = codeGlazing.map((glazing, index)=>{
                    return {
                        collection: name.match(/^\D*/gm).toString().trim(),
                        glazing,
                        content,
                        name: `${name} ${glazing}`,
                        finishingMaterial: imgsAll.map(({finishingMaterial, imgs}) => {
                            return {
                                name: finishingMaterial,
                                img: imgs[index]
                            };
                        })
                    };
                });

                products.push(...newProducts);
            }
        };

        return products;
    }
};

const getVariant = async (array, codeModel) => {
    return (await Promise.all(
        array.map((code) =>
            axios.get(
                encodeURI(decodeURI(`${domain}/ajax/configuratorGetVariant?otdelka_code=${code}&model_code=${codeModel}`))
            ))));
};

function getImgs(html) {
    let temp;
    const re = /src="([^"])+/gm;

    const imgs = [];

    do {
        temp = re.exec(html);
        if (temp) {
            imgs.push(`${domain}${temp[0].replace('src=\"', '')}`);
        }
    } while (temp);

    return imgs;
}
