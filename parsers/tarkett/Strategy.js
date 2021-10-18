const array2Map = (arr, field) => {
    const map = {};

    arr.forEach((item) => {
        map[item[field].toLowerCase()] = true;
    });

    return map;
};

class Strategy {
    constructor(collections) {
        this.collections = array2Map(collections, 'nameDealer');
        this.domainUrl = `https://www.tarkett.ru/ru_RU/collection-product-formats-json/fb04/`;
    }

    collectAllLinks(content) {
        const {collectionResult} = content;

        const links = new Set();

        collectionResult.forEach(({id, name}) => {
            if (name && this.collections[name.toLowerCase()]) {
                links.add(this.domainUrl + id);
            }
        });

        return links;
    }

    collectItem({results}) {
        return results.map(this.collectProduct.bind(this));
    }

    collectProduct(item) {
        const {
            sku_collection_ids,
            sku_category_b2b_names,
            sku_color_family,
            sku_color_name,
            sku_color_tone,
            sku_commercial_classification,
            sku_embossing_type,
            sku_fire_resistance,
            sku_locking_system,
            sku_thumbnail,
            sku_collection_names
        } = item;

        const _categoryType = sku_category_b2b_names[0];
        const color_family = sku_color_family.value;
        const color_tone = sku_color_tone.value;
        const sku_collection_id = sku_collection_ids[0];
        const collection = sku_collection_names[0];

        return {
            collection,
            name: `${collection} ${sku_color_name}`,
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
            ...this.collectSkuTechnicalCharacteristics(item)
        };
    }

    collectSkuTechnicalCharacteristics(item) {
        const {
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
            width,
            format_type
        } = item.sku_technical_caracteristics;

        return {
            format_type,
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
        };
    }
}

module.exports = {Strategy};