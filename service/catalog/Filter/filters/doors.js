class Doors {
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

    setBrandId(query, filter) {
        query.whereIn('collections.brandId', filter);
    }

    setFilterToQuery(query) {
        const entries = Object.entries(this.filter);

        for (const [key, filter] of entries) {
            const arrFilter = [].concat(filter);

            switch (key) {
            case 'brandId':
                this.setBrandId(query, arrFilter.map(Number));
                break;
            }
        }
    }
}

module.exports = {Doors};
