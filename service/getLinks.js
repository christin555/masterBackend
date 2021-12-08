
module.exports = {
    getLinks: async ({knex}) => {

        const [articles, products, categories] = await Promise.all([
            knex('articles').select('alias').whereNull('deletedAt'),
            knex('products').select('alias').whereNull('deleted_at'),
            knex('categories').select('alias').whereNull('deleted_at')
        ]
        );

        return [
            articles.map(({alias}) => `https://master-pola.com/blog/article/${alias}`),
            products.map(({alias}) => `https://master-pola.com/product/${alias}`),
            categories.map(({alias}) => `https://master-pola.com/catalog/${alias}`),
        ].flat();
    }
};
