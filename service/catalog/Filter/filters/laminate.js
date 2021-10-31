class Laminate {
    /**
   * @param {Knex} knex
   * @param {Object} filter
   */
    constructor(knex, filter) {
        this.knex = knex;
        this.filter = filter;
    }

    queryFields(field) {
        return `
          select t.value ->> 'name' as name
          from (
              select json_array_elements(values) as value
              from laminate_fields
              where field = '${field}'
              ) as t
          where (t.value ->> 'id'):: int in (:filter:)
        `;
    };

    setWithHeatingFloor(query) {
        query.whereNotNull('withHeatingFloor');
    }

    setBrandId(query, filter) {
        query.whereIn('brandId', filter);
    }

    setCollectionId(query, filter) {
        query.whereIn('collectionId', filter);
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
            switch (key) {
            case 'withHeatingFloor':
                this.setWithHeatingFloor(query);
                break;
            case 'brandId':
                this.setBrandId(query, filter);
                break;
            case 'collectionId':
                this.setCollectionId(query, filter);
                break;
            case 'width':
                this.setWidth(query, filter);
                break;
            case 'thickness':
                this.setThickness(query, filter);
                break;
            case 'color':
                this.setColor(query, filter);
                break;
            case 'resistanceClass':
                this.setResistanceClass(query, filter);
                break;
            }
        }
    }
}

module.exports = {Laminate};