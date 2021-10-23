const fs = require('fs');
const axios = require('axios');
const https = require('https');

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

module.exports = {
    saveImg: (img, path) => axios({
        method: 'get',
        url: encodeURI(decodeURI(img)),
        responseType: 'stream',
        maxRedirects: 500,
        httpsAgent
    }).then((response) => {
        response.data.pipe(fs.createWriteStream(path));
    }).catch(error => {
        console.log(error);
    })
};


