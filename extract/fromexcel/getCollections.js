const {array2Object} = require('../../service/tools/array2Object');

module.exports = {
    getCollections: async({knex}) => {
        const collections = await knex('collections').select(['collections.id', 'name']);

        return array2Object(collections, 'name');
    }
};


