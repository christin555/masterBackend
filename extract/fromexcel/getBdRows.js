const getBdRows = ({rows, knex}) => {
    const _rows = rows.reduce((res, {name, categoryId, collectionId}) => {
        res.push([name, categoryId, collectionId]);

        return res;
    }, []);

    console.log(_rows);
    return knex('products')
        .select(['id', 'name', 'categoryId', 'collectionId'])
        .whereIn(['name', 'categoryId', 'collectionId'], _rows);
};

module.exports = {
    getBdRows
};