module.exports = {
    getFinishingMaterials: async ({knex}) => {
        const finishingMaterials = await knex('finishingMaterialDoors')
            .select(['id', 'name']);
         

        return finishingMaterials;
    }
};
