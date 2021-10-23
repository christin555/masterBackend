const axios = require("axios");
const {fields} = require('./fields');

module.exports = {
    getProducts: async ({links}) => {
        const cards = await Promise.all(links.map((link) => axios.get(link)));

        return cards.map(({
            data: {
                data: {
                    article,
                    chamfer,
                    characteristics,
                    collection,
                    collection_description,
                    color,
                    description,
                    height,
                    images,
                    is_sample,
                    items_in_package,
                    length,
                    meters_in_package,
                    meters_in_piece,
                    mounting_type,
                    name,
                    protective_layer_thickness,
                    resistanceClass,
                    slug,
                    substrate_thickness,
                    thickness,
                    width
                }
            }
        }) => {
            const connectionType = mounting_type === 'lock' && 'Замковый' || 'Клеевой';

            return {
                article,
                chamfer,
                characteristics,
                collection,
                collection_description,
                color,
                description,
                height,
                imgs: images,
                is_sample,
                items_in_package,
                length,
                meters_in_package,
                meters_in_piece,
                mounting_type: connectionType,
                name,
                protective_layer_thickness,
                resistanceClass,
                slug,
                substrate_thickness,
                thickness,
                width,
                _categoryType: 'кварцвинил',
            };
        });
    }
};
