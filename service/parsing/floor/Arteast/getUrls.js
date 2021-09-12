const axios = require("axios");

const domain = 'https://arteast.pro:8443/api/product/';

module.exports = {
    getUrls: async ({URL}) => {
        const {data: {data}} = await axios.get(URL);
        return data.map(({slug})=> `${domain}${slug}`);
    }
};
