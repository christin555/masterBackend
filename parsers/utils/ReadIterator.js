const {FileSystem} = require('./FileSystem');
const path = require('path');

class ReadIterator {
    constructor(dirs) {
        this.dirs = dirs;
    }

    async* [Symbol.asyncIterator]() {
        for (const dir of this.dirs) {
            const dirContent = await FileSystem.syncReaddir(dir);

            for (const file of dirContent) {
                yield FileSystem.load(path.join(dir, file));
            }
        }
    }
}

module.exports = {ReadIterator};