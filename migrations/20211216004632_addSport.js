const {getCategoryByAlias} = require('../service/catalog/getCategoryByAlias');
exports.up = async(knex) => {
    const {id: categoryId} = await getCategoryByAlias({alias: 'sport', knex});

    const sql = `
    CREATE MATERIALIZED VIEW sport_fields as
select 'colorFamily' as field, json_agg(t) as values
from (
         select row_number() over () as id, -- генерируем id
                "colorFamily"        as name
         from products
         where "categoryId" = ${categoryId}
           and "colorFamily" is not null
         group by "colorFamily"
     ) as t
union all
select 'totalThickness' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                "totalThickness"    as name
         from products
         where "categoryId" = ${categoryId}
           and "totalThickness" is not null
         group by "totalThickness"
     ) as t
union all
select 'collections' as field, json_agg(t) as values
from (
         select distinct collections.id, collections.name, collections."brandId"
        from collections
                 inner join products on products."collectionId" = collections."id"
         where products."categoryId" = ${categoryId}
     ) as t;
  `;

    return knex.raw(sql);
};

exports.down = knex => {

};
