module.exports = {
    getCollections: async({knex, brand, fields}) => {
        const collections = knex('collections');

        if (!fields) {
            collections
                .distinct('nameDealer')
                .select(['collections.id', 'nameDealer']);
        } else {
            collections
                .distinct('collections.name')
                .select(fields);
        }

        if (brand) {
            collections.join('brands', 'brands.id', 'brandId')
                .where('alias', brand);
        }

        return collections;
    }
};


