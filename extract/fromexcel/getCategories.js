const {array2Object} = require("../../service/tools/array2Object");
module.exports = {
    getCategories: async ({knex}) => {
        const cat = await knex('categories').select(['id', 'alias']);

        return array2Object(cat, 'alias');
    }
};
