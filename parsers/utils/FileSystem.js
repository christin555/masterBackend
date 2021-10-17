const fs = require('fs');

class FileSystem {
    static mkdirP(path) {
        fs.mkdirSync(path, {recursive: true});
    }

    static _save(path, content) {
        const ws = fs.createWriteStream(path);

        ws.write(content);

        ws.on('finish', () => {
            console.log('success save');
        });
    }

    static saveRaw(path, content) {
        FileSystem._save(path, content);
    }

    static saveToJSON(path, content) {
        const ext = '.json';

        FileSystem._save(`${path}${ext}`, JSON.stringify(content));
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