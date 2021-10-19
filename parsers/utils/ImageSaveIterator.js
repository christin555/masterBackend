const axios = require('axios');
const http = require('http');
const https = require('https');
const fs = require('fs');
const {Utils} = require('./Utils');
const {resolve} = require('path');

const agentOpt = {
    keepAlive: true,
    maxFreeSockets: 3,
    scheduling: 'fifo',
    timeout: 5 * 1000,
    rejectUnauthorized: false
};

class ImageSaver {
    constructor() {
        this.axios = axios.create({
            httpsAgent: new https.Agent(agentOpt),
            httpAgent: new http.Agent(agentOpt),
            maxRedirects: 500,
            responseType: 'stream',
            method: 'get'
        });
    }

    setImages(images) {
        this.images = images;
    }

    async save() {
        for (const {src, url} of this.images) {
            const image = await this.axios.get(encodeURI(decodeURI(url)));
            const actualPath = resolve(__dirname, '../../', src);

            image.data.pipe(fs.createWriteStream(actualPath));

            console.log(`save ${actualPath} ${url}`);

            await Utils.sleep(400);
        }
    }
}

module.exports = {ImageSaver};