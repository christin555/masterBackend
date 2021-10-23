const fs = require('fs');
const {Utils} = require('./Utils');

const createDotByLevel = (level) => {
    if (level === 0) {
        return '.';
    }

    return '../'.repeat(level);
};

class FileSystem {
    static findRoot(level = 0) {
        const dirs = FileSystem.syncReaddir(createDotByLevel(level));

        if (dirs.includes('package.json')) {
            return createDotByLevel(level);
        }

        return FileSystem.findRoot(level + 1);
    }

    static writePipe(path) {
        return fs.createWriteStream(path);
    }

    static mkdirP(path) {
        fs.mkdirSync(path, {recursive: true});
    }

    static _save(path, content) {
        const ws = fs.createWriteStream(path);

        ws.write(content);

        ws.on('finish', () => {
            console.log('success save');
        });

        ws.on('error', (err) => {
            console.log('error', err);
        });
    }

    static saveRaw(path, content) {
        FileSystem._save(path, content);
    }

    /**
     *
     * @param path
     * @param content
     * @param {Object} opts
     * @param {boolean} [opts.ignoreDev = false] opts.ignoreDev
     */
    static saveToJSON(path, content, opts = {}) {
        const ext = '.ignore.json';

        if (Utils.isDev() || opts.ignoreDev) {
            FileSystem._save(`${path}${ext}`, JSON.stringify(content));
        } else {
            console.log('save in prod');
        }
    }

    static load(path) {
        return fs.readFileSync(path, {encoding: 'utf-8'});
    }

    static loadJSON(path) {
        try {
            return JSON.stringify(FileSystem.load(path));
        } catch(e) {
            console.log(e);
        }
    }

    static syncReaddir(dir) {
        return fs.readdirSync(dir, {encoding: 'utf-8'});
    }
}

module.exports = {FileSystem};