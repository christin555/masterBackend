const {getNextLevelCategory} = require("../service/catalog/getNextLevelCategory");
const {getCategoryByAlias} = require('../service/catalog/getCategoryByAlias');

exports.up = async (knex) => {
    const {id: categoryId_glue} = await getCategoryByAlias({alias: 'quartzvinyl_kleevay', knex});
    const {id: categoryId_lock} = await getCategoryByAlias({alias: 'quartzvinyl_zamkovay', knex});

    //throw new Error('1')
    const sql = `
    CREATE MATERIALIZED VIEW quartzvinyl_lock_fields as
select 'color' as field, json_agg(t) as values
from (
         select row_number() over () as id, -- генерируем id
                "color"        as name
         from products
         where "categoryId" = ${categoryId_lock}
           and "color" is not null and products.deleted_at is null
         group by "color"
     ) as t
union all
select 'texture' as field, json_agg(t) as values
from (
         select row_number() over () as id, -- генерируем id
                "texture"        as name
         from products
         where "categoryId" = ${categoryId_lock}
           and "texture" is not null and products.deleted_at is null
         group by "texture"
     ) as t
union all
select 'resistanceClasses' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                "resistanceClass"    as name
         from products
         where "categoryId" = ${categoryId_lock}
           and "resistanceClass" is not null and products.deleted_at is null
         group by "resistanceClass"
     ) as t
union all
select 'thickness' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                thickness            as name
         from products
         where "categoryId" = ${categoryId_lock}
           and thickness is not null and products.deleted_at is null
         group by thickness
     ) as t
union all
select 'width' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                width                as name
         from products
         where "categoryId" = ${categoryId_lock}
           and width is not null and products.deleted_at is null
         group by width
     ) as t
union all
select 'brands' as field, json_agg(t) as values
from (
         select brands.id, brands.name
         from brands
                  inner join collections on "brandId" = brands.id
                  inner join products on products."collectionId" = collections."id"
         where products."categoryId" = ${categoryId_lock} and brands.deleted_at is null
         group by brands.id
     ) as t
union all
select 'collections' as field, json_agg(t) as values
from (
         select distinct collections.id, collections.name, collections."brandId"
         from collections
                 inner join products on products."collectionId" = collections."id"
         where products."categoryId" = ${categoryId_lock} and collections.deleted_at is null
     ) as t;
  `;

    await knex.raw(sql);


    const sql_glue = `
    CREATE MATERIALIZED VIEW quartzvinyl_glue_fields as
select 'color' as field, json_agg(t) as values
from (
         select row_number() over () as id, -- генерируем id
                "color"        as name
         from products
         where "categoryId" = ${categoryId_glue}
           and "color" is not null
         group by "color"
     ) as t
union all
select 'texture' as field, json_agg(t) as values
from (
         select row_number() over () as id, -- генерируем id
                "texture"        as name
         from products
         where "categoryId" = ${categoryId_glue}
           and "texture" is not null and products.deleted_at is null
         group by "texture"
     ) as t
union all
select 'resistanceClasses' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                "resistanceClass"    as name
         from products
         where "categoryId" = ${categoryId_glue}
           and "resistanceClass" is not null and products.deleted_at is null
         group by "resistanceClass"
     ) as t
union all
select 'thickness' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                thickness            as name
         from products
         where "categoryId" = ${categoryId_glue}
           and thickness is not null and products.deleted_at is null
         group by thickness
     ) as t
union all
select 'width' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                width                as name
         from products
         where "categoryId" = ${categoryId_glue}
           and width is not null and products.deleted_at is null
         group by width
     ) as t
union all
select 'brands' as field, json_agg(t) as values
from (
         select brands.id, brands.name
         from brands
                  inner join collections on "brandId" = brands.id
                  inner join products on products."collectionId" = collections."id"
         where products."categoryId" = ${categoryId_glue} and brands.deleted_at is null
         group by brands.id
     ) as t
union all
select 'collections' as field, json_agg(t) as values
from (
         select distinct collections.id, collections.name, collections."brandId"
         from collections
                 inner join products on products."collectionId" = collections."id"
         where products."categoryId" = ${categoryId_glue} and collections.deleted_at is null
     ) as t;
  `;

    await knex.raw(sql_glue);
};

exports.down = knex => Promise.all([
    knex.raw('drop MATERIALIZED view quartzvinyl_lock_fields'),
    knex.raw('drop MATERIALIZED view quartzvinyl_glue_fields')
]);
