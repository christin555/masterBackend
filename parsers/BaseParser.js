const {
    Utils,
    LinksIterator
} = require('./utils');

class BaseParser {
    /**
     *
     * @param {string} baseUrl
     * @param {string[]} links
     * @param {Strategy} strategy
     * @param {Object} opt
     * @param {number} [opt.ms = 1000] opt.ms
     * @param {number}[opt.msBetweenUrl = 500] opt.msBetweenUrl
     */
    constructor(baseUrl, links, strategy, opt) {
        this.baseUrl = baseUrl;
        this.links = links;
        this.strategy = strategy;
        this.opt = opt;
    }

    async parse() {
        const iterator = new LinksIterator(
            this.baseUrl,
            this.links,
            this.opt
        );

        const itemsLinks = new Map();

        for await (const {url, data} of iterator) {
            itemsLinks.set(url, this.strategy.collectAllLinks(data));
        }

        const res = [];
        const msBetweenUrl = this.opt.msBetweenUrl || 500;

        for (const [, linksSet] of itemsLinks.entries()) {
            const data = await this.collectItems(linksSet);

            res.push(data);

            await Utils.sleep(msBetweenUrl);
        }

        return res.flat();
    }


    async collectItems(links) {
        const iterator = new LinksIterator(
            this.baseUrl,
            [...links],
            this.opt
        );

        const items = [];

        for await (const {data} of iterator) {
            items.push(this.strategy.collectItem(data));
        }

        return items;
    };
}

module.exports = {BaseParser};