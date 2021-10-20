const axios = require('axios');
const http = require('http');
const https = require('https');
const fs = require('fs');
const {Utils} = require('./Utils');
const {resolve, dirname, basename} = require('path');
const {FileSystem} = require('./FileSystem');

const agentOpt = {
    keepAlive: true,
    maxFreeSockets: 3,
    scheduling: 'fifo',
    timeout: 5 * 1000,
    rejectUnauthorized: false
};

class ImageSaver {
    constructor(logger, ms) {
        this.logger = logger;

        this.axios = axios.create({
            httpsAgent: new https.Agent(agentOpt),
            httpAgent: new http.Agent(agentOpt),
            maxRedirects: 500,
            responseType: 'stream',
            method: 'get'
        });

        this.ms = ms || 400;

        this.root = FileSystem.findRoot();
    }

    async save(images) {
        // При первом запуске папки с картинками может и не быть
        // поэтому создаём папку static/images/ динамически
        // если такая папка уже будет существовать, то код ничего не делает
        const path = dirname(images[0].src);
        FileSystem.mkdirP(resolve(this.root, path));

        const failed = [];

        for (const {src, url} of images) {
            try {
                await this.downloadImage(url, src);
            } catch(err) {
                this.logger.error(`download ${url} is failed reason: ${err.message}`);

                failed.push(basename(src));
            } finally {
                await Utils.sleep(this.ms);
            }
        }

        return failed;
    }

    async downloadImage(url, src) {
        const image = await this.axios
            .get(encodeURI(decodeURI(url)));

        // Генерируем полный путь до папки
        const actualPath = resolve(this.root, src);
        const ws = fs.createWriteStream(actualPath);

        ws.on('error', (err) => {
            this.logger.error('Error occurred when save image on disk', err);
        });

        // По окончанию сохранения изображения закрываем стрим
        ws.on('finish', () => {
            this.logger.debug(`save ${actualPath} ${url}`);
            ws.close();
        });

        image.data.pipe(ws);
    }
}

module.exports = {ImageSaver};