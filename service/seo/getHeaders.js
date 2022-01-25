const ErrorHandler = require("../tools/Error");
module.exports = {
    getHeaders: async ({knex, body}) => {
        try {

            const {asPath, query, pathname} = body;
            const alias = pathname.substring(pathname.lastIndexOf("[") + 1, pathname.lastIndexOf("]"));

            return knex('seoTags')
                .first()
                .where('asPath', asPath)
                .orWhere('param', query[alias] || '')
                .orderByRaw(`"asPath" = ? desc`, asPath);

        } catch (e) {
            new ErrorHandler({message: e.message});
        }
    }
};
