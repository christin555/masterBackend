const {getCategoryByAlias} = require('../service/catalog/getCategoryByAlias');
exports.up = async(knex) => {
    const {id: categoryId} = await getCategoryByAlias({alias: 'laminate', knex});

    const sql = `
    CREATE MATERIALIZED VIEW laminate_fields as
select 'color' as field, json_agg(t) as values
from (
         select row_number() over () as id, -- генерируем id
                "color"        as name
         from products
         where "categoryId" = ${categoryId}
           and "color" is not null
         group by "color"
     ) as t
union all
select 'resistanceClasses' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                "resistanceClass"    as name
         from products
         where "categoryId" = ${categoryId}
           and "resistanceClass" is not null
         group by "resistanceClass"
     ) as t
union all
select 'thickness' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                thickness            as name
         from products
         where "categoryId" = ${categoryId}
           and thickness is not null
         group by thickness
     ) as t
union all
select 'width' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                width                as name
         from products
         where "categoryId" = ${categoryId}
           and width is not null
         group by width
     ) as t
union all
select 'brands' as field, json_agg(t) as values
from (
         select brands.id, brands.name
         from brands
                  inner join collections on "brandId" = brands.id
         where collections."categoryId" = ${categoryId}
         group by brands.id
     ) as t
union all
select 'collections' as field, json_agg(t) as values
from (
         select distinct collections.id, collections.name, collections."brandId"
         from collections
         where collections."categoryId" = ${categoryId} and collections.deleted_at is null
     ) as t;
  `;

    return knex.raw(sql);
};

exports.down = knex => {

};
