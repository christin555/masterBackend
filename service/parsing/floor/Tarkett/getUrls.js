const axios = require("axios");

const domain = 'https://www.tarkett.ru/ru_RU/collection-product-formats-json/fb04/';

module.exports = {
    getUrls: async ({URL, collectionsName}) => {
        console.log('startParse Tarket, get links of product');

        const productIds = new Set();
        const collectionsHtml = await Promise.all([
            axios.get(URL).then(({data}) => data),
            axios.get(`${URL}&page=2`).then(({data}) => data)
        ]
        );
        const descriptions = {};
        
        collectionsHtml.flat().filter(Boolean).forEach(({collectionResult}) => {
            collectionResult.forEach(({id, name, description}) => {
                descriptions[id] = description;

                if (name && collectionsName && collectionsName.includes(name.toLowerCase())) {
                    productIds.add(id);
                }
            });
        });

        const productUrlsDomain = Array.from(productIds).map((absPath) => `${domain}${absPath}`);

        return productUrlsDomain;
    }
};

