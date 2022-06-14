const coll = [
    'Onyx Аmber',
    'Onyx Pink',
    'Regal Carara',
    'Brecia Ivory',
    'Brecia Silver',
    'Colonial White',
    'Salvatore',
    'Ardesia Grafito',
    'Costa Grey',
    'Costa Cream',
    'Adagio',
    'Lambert Bianco',
    'Vendome Blanco',
    'Arena white',
    'Titan black',
    'Namibian Marble',
    'Golde Beige',
    'Dario',
    'Black Morgan',
    'Golden Black',
    'Bigium Blue',
    'Essence Grey',
    'Fedele Negro',
    'Galeno Grafito',
    'Golden Grey',
    'Montreal Dark Grey',
    'Montreal Grey',
    'Zola Crema',
    'Toledo black'
];
const brand = {
    name: 'Primavera',
    alias: 'primavera'
};

const collections = (brandId) => {
    return coll.map(name => {
        return {
            name,
            brandId,
            nameDealer: name
        };
    });
};
exports.up = async function(knex) {
    const [brandId] = await knex('brands')
        .insert(brand)
        .returning('id');

    await knex('collections')
        .insert(collections(brandId.id));
};

exports.down = function(knex) {
  
};
