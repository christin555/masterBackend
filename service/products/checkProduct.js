const ErrorHandler = require("../tools/Error");
const {checkProduct} = require('./checkProduct');

module.exports = {
    checkProduct: async ({alias, knex}) => {
        const product = await knex('products')
            .first('id')
            .where('alias', alias);

        if (!product) {
            new ErrorHandler({
                message: 'Product not found',
                status: 400
            });
        }
    }
};
