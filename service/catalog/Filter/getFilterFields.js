const doorsFilterValues = async(knex) => {
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

const laminateFilterValues = async(knex) => {
    const sql = `json_object_agg(laminate_fields.field, laminate_fields.values) as values`;

    const {values} = await knex('laminate_fields').first(knex.raw(sql));

    return values;
};

const stonewareFilterValues = (body, knex) => {

};

const quartzVinylTileFilterValues = (body, knex) => {

};

const quartzVinylTileLockFilterValues = (body, knex) => {

};

const quartzVinylTileGlueFilterValues = (body, knex) => {

};

const sportFilterValues = (body, knex) => {

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
    getFilterFields: async({body, knex}) => {
        const {category} = body;

        const handler = filtersHandlers[category];

        if (!handler) {
            throw new Error('Unhandled category');
        }

        return handler(knex);
    }
};