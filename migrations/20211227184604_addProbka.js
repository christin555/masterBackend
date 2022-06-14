const {addCollection} = require("./tools/addCollectionsWithBrand");

const coll = [
    'Go-Pure',
    'Go',
    'Pure'
];
const brand = {
    name: 'Wicanders',
    alias: 'wicanders'
};

exports.up = async (knex) => {
    await knex('categories')
        .insert({
            alias: 'probkovoe_pokrytie',
            name: 'Пробковое покрытие',
            level: 2,
            isLast:true,
            img: '/dashboard/uploads/52ec984cc72302fd412e2aa145a6526c_XL_3564cf1886.jpg'
        });


    return addCollection(knex, brand, coll);
};


exports.down = function (knex) {
};
