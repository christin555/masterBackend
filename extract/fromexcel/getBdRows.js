const getBdRows = ({rows, knex}) => {
    return knex('products')
        .select(['id', 'alias'])
        .whereIn('alias', rows.map(({alias}) => alias));
};

module.exports = {
    getBdRows
};
