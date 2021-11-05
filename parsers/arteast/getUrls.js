const axios = require("axios");

const domain = 'https://arteast.pro:8443/api/product/';

module.exports = {
    getUrls: async ({URLs}) => {
        const productUrls = [];
        const urlsData = await Promise.all(URLs.map((link) => axios.get(link)));

        urlsData.forEach(({data: {data}})=> {
            data.forEach(({slug}) => productUrls.push(`${domain}${slug}`));
        });

        return productUrls;
    }
};
