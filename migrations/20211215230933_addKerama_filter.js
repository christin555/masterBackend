const {getCategoryByAlias} = require('../service/catalog/getCategoryByAlias');
exports.up = async(knex) => {
    const {id: categoryId} = await getCategoryByAlias({alias: 'keramogranit', knex});

    const sql = `
    CREATE MATERIALIZED VIEW keramogranit_fields as
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
select 'texture' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                texture                as name
         from products
         where "categoryId" = ${categoryId}
           and texture is not null
         group by texture
     ) as t
union all
select 'size' as field, json_agg(t) as values
from (
         select row_number() over () as id,
                size                as name
         from products
         where "categoryId" = ${categoryId}
           and size is not null
         group by size
     ) as t
  `;

    return knex.raw(sql);
};

exports.down = knex => {

};
