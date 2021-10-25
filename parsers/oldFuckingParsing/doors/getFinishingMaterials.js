module.exports = {
    getFinishingMaterials: ({knex}) => {
        return knex('finishingMaterialDoors')
            .select(['id', 'name']);
    }
};
