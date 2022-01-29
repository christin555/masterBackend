const ErrorHandler = require("../tools/Error");

module.exports = {
    checkCatalog: async ({alias, knex}) => {
        const catalog = await knex('categories')
            .first('id')
            .where('alias', alias);


        if (!catalog) {
            new ErrorHandler({
                message: 'Catalog not found',
                status: 400
            });
        }
    }
};
