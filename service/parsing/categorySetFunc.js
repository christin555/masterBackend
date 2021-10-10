module.exports = {
    categorySetFunc: ({itemBd, item, categoriesObject}) => {
        if (item._categoryType.toLowerCase() === 'ламинат') {
            itemBd.categoryId = categoriesObject['laminate'].id;
        }

        if (item._categoryType.toLowerCase() === 'кварцвинил') {
            const {connectionType} = itemBd;

            if (connectionType) {
                if (connectionType.toLowerCase().includes("клеев")) {
                    itemBd.categoryId = categoriesObject['quartzvinyl_kleevay'].id;
                }

                if (connectionType.toLowerCase().includes("замков")) {
                    itemBd.categoryId = categoriesObject['quartzvinyl_zamkovay'].id;
                }
            }
        }
    }
};


