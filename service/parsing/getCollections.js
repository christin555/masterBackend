module.exports = {
    getCollections: async({knex, brand}) => {
        const collections = knex('collections')
            .distinct('nameDealer')
            .select(['collections.id', 'nameDealer']);

        if (brand) {
            collections.join('brands', 'brands.id', 'brandId')
                .where('alias', brand);
        }

        return (await collections);
    }
};


