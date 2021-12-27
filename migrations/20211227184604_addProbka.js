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

exports.up = async(knex) => addCollection(knex, brand, coll);


exports.down = function (knex) {};
