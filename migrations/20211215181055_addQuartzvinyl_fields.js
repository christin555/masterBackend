const {getNextLevelCategory} = require("../service/catalog/getNextLevelCategory");
const {getCategoryByAlias} = require('../service/catalog/getCategoryByAlias');

exports.up = async (knex) => {
    const {id: categoryId} = await getCategoryByAlias({alias: 'quartzvinyl', knex});
    const cids = await getNextLevelCategory({categoryId, knex});
    const ids = cids.map(({id}) => id);

   // console.log(cids);

    //throw new Error('1')
    const sql = `
    CREATE MATERIALIZED VIEW quartzvinyl_fields as
select 'color' as field, json_agg(t) as values
from (
         select row_number() over () as id, -- генерируем id
                "color"        as name
         from products
         where "categoryId" in (${ids})
           and "color" is not null
         group by "color"
     ) as t
union all
select 'texture' as field, json_agg(t) as values
from (
         select row_number() over () as id, -- генерируем id
                "texture"        as name
         from products
         where "categoryId" in (${ids})
           and "texture" is not null
         group by "texture"
     ) as t
union all
select 'resistanceClasses' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                "resistanceClass"    as name
         from products
         where "categoryId" in (${ids})
           and "resistanceClass" is not null
         group by "resistanceClass"
     ) as t
union all
select 'thickness' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                thickness            as name
         from products
         where "categoryId" in (${ids})
           and thickness is not null
         group by thickness
     ) as t
union all
select 'width' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                width                as name
         from products
         where "categoryId" in (${ids})
           and width is not null
         group by width
     ) as t
union all
select 'brands' as field, json_agg(t) as values
from (
         select brands.id, brands.name
         from brands
                  inner join collections on "brandId" = brands.id
                  inner join products on products."collectionId" = collections."id"
         where products."categoryId" in (${ids}) and brands.deleted_at is null
         group by brands.id
     ) as t
union all
select 'collections' as field, json_agg(t) as values
from (
         select distinct collections.id, collections.name, collections."brandId"
         from collections
                 inner join products on products."collectionId" = collections."id"
         where products."categoryId" in (${ids}) and collections.deleted_at is null
     ) as t;
  `;

    return knex.raw(sql);
};

exports.down = knex => {

};
