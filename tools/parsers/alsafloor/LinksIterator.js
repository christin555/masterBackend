const axios = require('axios');
const http = require('http');
const https = require('https');

const sleep = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

class LinksIterator {
    constructor(baseUrl, urls, opt) {
        const agentOpt = {
            keepAlive: true,
            maxFreeSockets: 3,
            scheduling: 'fifo',
            timeout: 5 * 1000
        };

        this.urls = urls;

        axios.defaults.httpsAgent = new https.Agent(agentOpt);
        axios.defaults.httpAgent = new http.Agent(agentOpt);
        axios.defaults.baseURL = baseUrl;

        this.ms = opt.ms;
    }

    async* [Symbol.asyncIterator]() {
        for (const url of this.urls) {
            try {
                const {data, status} = await axios
                    .get(url);

                console.log(`${url} is up, status: ${status}`);

                yield {url, data};
                await sleep(this.ms);
            } catch(e) {
                yield `${url} is down, error ${e.message}`;
            }
        }
    }
}

module.exports = LinksIterator;