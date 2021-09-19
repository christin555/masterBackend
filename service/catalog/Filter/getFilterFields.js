module.exports = {
    getFilterFields: async ({body, knex}) => {
        const {category, values = {}} = body;

        if(!category){
            return [];
        }

        console.log(category);
        const {id: categoryId} = await knex('categories')
            .first('id')
            .where('alias', category);
        
        values.categoryId = categoryId;
        
        const [fields, catalogItems] = await Promise.all([
            knex('catalogItemsCategory')
                .pluck('catalogItemId')
                .leftJoin('catalogs', 'catalogs.id', 'catalogId')
                .where('categoryId', categoryId)
                .where('catalogs.name', 'filterFields'),
            knex('catalogItems')
                .pluck('item')
                .leftJoin('catalogs', 'catalogs.id', 'catalogId')
                .where('catalogs.name', 'filterFields')
        ]);

        const categoryFields = catalogItems.filter(({id}) => fields.includes(id));
        const objectTablesValues = await getObjectTablesValues({categoryFields, knex, values});

        const fieldsFilter =  categoryFields.map(({name, ...item}) => {
            
            if(objectTablesValues[name])
                return {
                    name,
                    ...item,
                    values: objectTablesValues[name]
                };
            else {
                return {name, ...item};
            }
        });

        console.log(fieldsFilter);

        return fieldsFilter;
    }
};
getObjectTablesValues = async ({categoryFields, knex, values}) => {
    const tableFields = categoryFields.filter(({values}) => values.entity === 'table');
    const tables = await Promise.all(tableFields.map(({values: {name, filterBy}}) =>{
        const query = knex(name).select();
        
        if(filterBy){
            filterBy.forEach((filterColumn) => {
                if(values[filterColumn]){
                    query.where(filterColumn, values[filterColumn]);
                }
            }) ;
        }
        return query;
    }));

    const objectTables = {};

    tableFields.forEach(({name}, index) => {
        objectTables[name] = tables[index];
    });

    return objectTables;
};
