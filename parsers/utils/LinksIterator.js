const axios = require('axios');
const http = require('http');
const https = require('https');
const {Utils: {sleep}} = require('./Utils');
const iconv = require('iconv-lite');

class LinksIterator {
    /**
     * @param {string} baseUrl
     * @param {string[]} urls
     * @param {Object} opt
     * @param {number}[opt.ms = 1000] opt.ms
     */
    constructor(baseUrl, urls, opt) {
        const agentOpt = {
            keepAlive: true,
            maxFreeSockets: 3,
            scheduling: 'fifo',
            timeout: 5 * 1000,
            rejectUnauthorized: false
        };

        this.urls = urls;
        this.baseUrl = baseUrl;

        this.axios = axios.create({
            baseURL: baseUrl,
            httpsAgent: new https.Agent(agentOpt),
            httpAgent: new http.Agent(agentOpt)
        });

        this.ms = opt.ms || 1000;
    }

    async* [Symbol.asyncIterator]() {
        for (const url of this.urls) {
            try {
                const {data, status} = await this.axios
                    .get(url, {
                        responseType: 'arraybuffer',
                        responseEncoding: 'binary'
                    })
                    .then(({data, status}) =>{
                        return {
                            data: iconv.decode(Buffer.from(data), 'windows-1251'),
                            status
                        };
                    });

                console.log(`${url} is up, status: ${status}`);
                yield {url, data};
                await sleep(this.ms);
            } catch (error) {
                console.log(`skip ${this.baseUrl} ${url} cause ${error.message}`);
                yield {error};
            }
        }
    }
}

module.exports = {LinksIterator};
