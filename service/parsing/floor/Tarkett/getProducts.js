const axios = require("axios");

module.exports = {
    getProducts: async ({links}) => {
        const cards = await Promise.all(links.map((link) => axios.get(link)));
        const products = [];
        
        cards.map(({data: {results}}) => {
            results.map(({
                sku_collection_ids,
                sku_category_b2b_names,
                sku_color_family,
                sku_color_name,
                sku_color_tone,
                sku_commercial_classification,
                sku_embossing_type,
                sku_fire_resistance,
                sku_locking_system,
                sku_technical_caracteristics,
                sku_thumbnail,
                sku_collection_names
            }) => {
                const _categoryType = sku_category_b2b_names[0];
                const color_family = sku_color_family.value;
                const color_tone = sku_color_tone.value;
                const sku_collection_id = sku_collection_ids[0];
                const collection = sku_collection_names[0];

                const {
                    abrasion_resistance_en_13329,
                    base_board,
                    format_type,
                    basis_weight,
                    construction_process,
                    furniture_leg_effect,
                    installation_method,
                    items_per_box,
                    length,
                    professional_warranty,
                    residential_warranty,
                    surface_per_box,
                    total_thickness,
                    underfloor_heating,
                    weight_per_box,
                    width
                } = sku_technical_caracteristics;

                products.push({
                    collection,
                    name: `${collection} ${sku_color_name}`,
                    format_type,
                    imgs: [`https://www.tarkett.ru/media/img/large/${sku_thumbnail}`],
                    color_tone,
                    sku_locking_system,
                    sku_commercial_classification,
                    sku_embossing_type,
                    sku_fire_resistance,
                    _categoryType,
                    sku_collection_id,
                    color_family,
                    sku_color_name,
                    abrasion_resistance_en_13329,
                    base_board,
                    basis_weight,
                    construction_process,
                    furniture_leg_effect,
                    installation_method,
                    items_per_box,
                    length,
                    professional_warranty,
                    residential_warranty,
                    surface_per_box,
                    total_thickness,
                    underfloor_heating,
                    weight_per_box,
                    width
                });
            });

        });

        return products;
    }
};
