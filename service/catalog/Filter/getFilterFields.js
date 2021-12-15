const doorsFilterValues = async (knex) => {
    const sql = `
        select json_build_object(
                       'collections',
                       (
                           select array_agg(json_build_object('id', id, 'name', name))
                           from collections
                           where "categoryId" = (
                               select id
                               from categories
                               where alias = 'doors'
                           )
                       ),
                       'finishingMaterials',
                       (
                           select array_agg(json_build_object('id', id, 'name', name))
                           from "finishingMaterialDoors"
                       )
                   ) as
        values
    `;

    const {rows: [res]} = await knex.raw(sql);

    return res.values;
};

const floorsFilterValues = (body, knex) => {

};

const laminateFilterValues = async (knex) => {
    // Вообще бы конечно лучше обновлять триггером, может когда-нибудь...
    await knex.raw(`refresh materialized view laminate_fields`);

    const sql = `json_object_agg(laminate_fields.field, laminate_fields.values) as values`;

    // laminate_fields - это материализованная таблица, которая собирает данные для полей фильтра
    const {values} = await knex('laminate_fields').first(knex.raw(sql));

    return values;
};

const stonewareFilterValues = async (knex) => {
    await knex.raw(`refresh materialized view keramogranit_fields`);

    const sql = `json_object_agg(keramogranit_fields.field, keramogranit_fields.values) as values`;

    const {values} = await knex('keramogranit_fields').first(knex.raw(sql));

    return values;
};

const fixation = [
    {id: 6, name: 'Замок'},
    {id: 7, name: 'Клей'}
];
const quartzVinylTileFilterValues = async (knex) => {
    await knex.raw(`refresh materialized view quartzvinyl_fields`);

    const sql = `json_object_agg(quartzvinyl_fields.field, quartzvinyl_fields.values) as values`;

    // laminate_fields - это материализованная таблица, которая собирает данные для полей фильтра
    const {values} = await knex('quartzvinyl_fields').first(knex.raw(sql));

    return {...values, fixation};
};

const quartzVinylTileLockFilterValues = async (knex) => {
    await knex.raw(`refresh materialized view quartzvinyl_lock_fields`);

    const sql = `json_object_agg(quartzvinyl_lock_fields.field, quartzvinyl_lock_fields.values) as values`;

    const {values} = await knex('quartzvinyl_lock_fields').first(knex.raw(sql));

    return values;
};

const quartzVinylTileGlueFilterValues = async (knex) =>{
    await knex.raw(`refresh materialized view quartzvinyl_glue_fields`);

    const sql = `json_object_agg(quartzvinyl_glue_fields.field, quartzvinyl_glue_fields.values) as values`;

    const {values} = await knex('quartzvinyl_glue_fields').first(knex.raw(sql));

    return values;
};

const sportFilterValues = async (knex) =>{
    await knex.raw(`refresh materialized view sport_fields`);

    const sql = `json_object_agg(sport_fields.field, sport_fields.values) as values`;

    const {values} = await knex('sport_fields').first(knex.raw(sql));

    return values;
};


const filtersHandlers = {
    doors: doorsFilterValues,
    floors: floorsFilterValues,
    laminate: laminateFilterValues,
    keramogranit: stonewareFilterValues,
    quartzvinyl: quartzVinylTileFilterValues,
    quartzvinyl_zamkovay: quartzVinylTileLockFilterValues,
    quartzvinyl_kleevay: quartzVinylTileGlueFilterValues,
    sport: sportFilterValues
};

module.exports = {
    getFilterFields: async ({body, knex}) => {
        const {category} = body;

        const handler = filtersHandlers[category];

        if (!handler) {
            throw new Error('Unhandled category');
        }

        return handler(knex);
    }
};
