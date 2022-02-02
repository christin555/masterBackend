const {getNextLevelCategory} = require("../service/catalog/getNextLevelCategory");
const {getCategoryByAlias} = require('../service/catalog/getCategoryByAlias');

exports.up = async (knex) => {
    const {id: categoryId} = await getCategoryByAlias({alias: 'probkovoe_pokrytie', knex});

    const sql = `
    CREATE MATERIALIZED VIEW probka_fields as
select 'texture' as field, json_agg(t) as values
from (
         select row_number() over () as id, -- генерируем id
                "texture"        as name
         from products
         where "categoryId" = ${categoryId}
           and "texture" is not null
         group by "texture"
     ) as t
union all
select 'size' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                size            as name
         from products
         where "categoryId" = ${categoryId}
           and size is not null
         group by size
     ) as t
union all
select 'collectionId' as field, json_agg(t) as values
from (
         select distinct collections.id, collections.name, collections."brandId"
         from collections
                 inner join products on products."collectionId" = collections."id"
         where products."categoryId" = ${categoryId}
     ) as t
union all
select 'fixationType' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                "fixationType"                as name
         from products
         where "categoryId" = ${categoryId}
           and "fixationType" is not null
         group by "fixationType"
     ) as t
  `;

    return knex.raw(sql);
};

exports.down = knex => {};
