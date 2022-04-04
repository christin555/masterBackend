const {FileSystem} = require("../parsers/utils");
const {resolve, dirname, basename} = require('path');
const {entity} = require('../enums');

module.exports = {
    upload: async ({files, body}) => {
        const {alias} = body;
        const imageFile = files.file;
        const fileName = alias ? alias + '_' + Date.now().toString() : imageFile.name;

        try {
            this.root = FileSystem.findRoot();

            const path = `/static/images/${String(entity.PRODUCT)}`;

            FileSystem.mkdirP(resolve(this.root, path));

            const imgPath = path + '/' + fileName;
            const actualPath = resolve(this.root, imgPath);

            await imageFile.mv(actualPath);

            return imgPath;
        } catch (error) {
            return error;
        }

    }
};
