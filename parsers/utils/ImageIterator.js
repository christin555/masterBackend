const crypto = require('crypto');
const path = require('path');

class ImageHashIterator {
    constructor() {
        this.images = {};
    }

    /**
     * @param {string} key
     * @param {string[]} images
     */
    push(key, images) {
        this.images[key] = images;
    }

    * [Symbol.iterator]() {
        for (const alias in this.images) {
            const imgs = this.images[alias];

            const images = [];

            for (const imgUrl of imgs) {
                const hash = crypto.createHash('md5').update(imgUrl);
                const ext = path.extname(imgUrl);

                images.push({
                    path: hash.digest('hex') + ext,
                    url: imgUrl
                });
            }

            yield {
                alias,
                images
            };
        }
    }
}

module.exports = {ImageHashIterator};