const table = {
    laminate: 'laminate_fields',
    quartzvinyl: 'quartzvinyl_fields',
    keramogranit: 'keramogranit_fields',
    quartzvinyl_zamkovay: 'quartzvinyl_lock_fields',
    quartzvinyl_kleevay: 'quartzvinyl_glue_fields',
    sport: 'sport_fields',
    probkovoe_pokrytie: 'probka_fields'
};

class Floors {
    /**
     * @param {Knex} knex
     * @param {Object} filter
     * @param {String} category
     */
    constructor(knex, filter, category) {
        this.knex = knex;
        this.filter = filter;
        this.category = category;
    }

    queryFields(field) {
        return `
            select t.value ->> 'name' as name
            from (
                select json_array_elements(values) as value
                from ${table[this.category]}
                where field = '${field}'
                ) as t
            where (t.value ->> 'id'):: int = any (:filter)
        `;
    };

    setWithHeatingFloor(query) {
        query.whereNotNull('withHeatingFloor');
    }

    setBestseller(query) {
        query.whereNotNull('isPopular');
    }

    setBrandId(query, filter) {
        query.whereIn('brandId', filter);
    }

    setCollectionId(query, filter) {
        query.whereIn('collectionId', filter);
    }

    setSize(query, filter) {
        query.whereRaw(
            `"size" in (${this.queryFields('size')})`,
            {filter}
        );
    }

    setColorFamily(query, filter) {
        query.whereRaw(
            `"colorFamily" in (${this.queryFields('colorFamily')})`,
            {filter}
        );
    }

    setTotalThickness(query, filter) {
        query.whereRaw(
            `"totalThickness" in (${this.queryFields('totalThickness')})`,
            {filter}
        );
    }

    setField(query, filter, field){
        query.whereRaw(
            `"${field}" in (${this.queryFields(field)})`,
            {filter}
        );
    }

    setTexture(query, filter) {
        query.whereRaw(
            `"texture" in (${this.queryFields('texture')})`,
            {filter}
        );
    }

    setFixation(query, filter) {
        query.whereIn('products.categoryId', filter);
    }

    setColor(query, filter) {
        query.whereRaw(
            `"color" in (${this.queryFields('color')})`,
            {filter}
        );
    }

    setResistanceClass(query, filter) {
        query.whereRaw(
            `"resistanceClass" in (${this.queryFields('resistanceClasses')})`,
            {filter}
        );
    }

    setThickness(query, filter) {
        query.whereRaw(
            `"thickness" in (${this.queryFields('thickness')})`,
            {filter}
        );
    }

    setWidth(query, filter) {
        query.whereRaw(
            `"width" in (${this.queryFields('width')})`,
            {filter}
        );
    }

    setFilterToQuery(query) {
        const entries = Object.entries(this.filter);

        for (const [key, filter] of entries) {
            const arrFilter = [].concat(filter);

            switch (key) {
            case 'withHeatingFloor':
                this.setWithHeatingFloor(query);
                break;
            case 'bestseller':
                this.setBestseller(query);
                break;
            case 'collections':
                this.setCollectionId(query, arrFilter);
                break;
            case 'brandId':
            case 'brands':
                this.setBrandId(query, arrFilter);
                break;
            case 'width':
                this.setWidth(query, arrFilter);
                break;
            case 'thickness':
                this.setThickness(query, arrFilter);
                break;
            case 'color':
                this.setColor(query, arrFilter);
                break;
            case 'texture':
                this.setTexture(query, arrFilter);
                break;
            case 'size':
                this.setSize(query, arrFilter);
                break;
            case 'fixation':
                this.setFixation(query, arrFilter.map(Number));
                break;
            case 'resistanceClass':
            case 'resistanceClasses':
                this.setResistanceClass(query, arrFilter);
                break;
            case 'colorFamily':
                this.setColorFamily(query, arrFilter);
                break;
            case 'totalThickness':
                this.setTotalThickness(query, arrFilter);
                break;
            case 'fixationType':
                this.setField(query, arrFilter, 'fixationType');
                break;
            }
        }
    }
}

module.exports = {Floors};
