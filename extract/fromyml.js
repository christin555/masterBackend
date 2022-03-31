const knex = require('../knex');
const convert = require('xml-js');
const axios = require("axios");
const fs = require('fs');
const {resolve, dirname} = require('path');
const {FileSystem} = require('../parsers/utils/FileSystem');
const {array2Object} = require("../service/tools/array2Object");
const {SaveProducts} = require("./save/SaveProducts");
const json = require('../decoria.json')


const start = async () => {
    console.log('start extracting products to yml');

    try {

       // const catalog_export = await axios.get('https://decomaster.su/bitrix/catalog_export/export_JcB.xml').then(({data}) => data);
       // const result = convert.xml2json(catalog_export, {ignoreComment: true, compact: true, alwaysChildren: false});
      
       // save(result);
       // return;


        const root = json.yml_catalog;
        const categories = root.shop.categories.category
            .map(({_attributes, _text}) => {
                return {..._attributes, name: _text};
            });
        const categories_obj = array2Object(categories, 'id');
        const filtered_categories = categories.filter(({name}) => name.toLowerCase().includes('плинтус'));
        const filtered_categories_ids = filtered_categories.map(({id}) => id);

        const filtered_offers = root.shop.offers
            .offer.filter(({categoryId, _attributes}) =>
                _attributes.available && filtered_categories_ids.includes(categoryId._text))
            .map(({_attributes, ...elements}) => {
                const t = Object.entries(elements).reduce((elms, [key, value]) => {
                    if (key === 'param') {
                        value.forEach(({_attributes: {name}, _text}) => {
                            elms[name] = _text;
                        });
                    } else if (key === 'picture') {
                        elms['images'] = value?._text && [value._text] || value?.map(({_text}) => _text);
                    } else {
                        elms[key] = value?._text || value?._cdata || value;
                    }
                    return elms;
                }, {});

                return {
                    ...t,
                    id: _attributes.id,
                    _categoryType: 'плинтус',
                    collectionName: categories_obj[categories_obj[t.categoryId].parentId].name
                };
            });

        

        const saver = new SaveProducts(
            filtered_offers,
            {knex}
        );

       // await saver.save();

        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};

// const catergories_with_heier = categories.reduce((res, {id, parentId, name}) => {
//     if (parentId) {
//         return gerHierarchy(res, parentId, {id, name});
//     } else {
//         res[id] = {name, id, children: {}};
//     }
//     return res;
// }, {});
// filterHierarchy(filtered_categories, catergories_with_heier, 1141);

// const filterHierarchy = (filtered_categories, categories, key) => {
//     if (!categories[key].children) {
//         delete categories[key];
//     } else {
//         Object.keys(categories[key].children).forEach((_key) => {
//             if (!filtered_categories.includes(_key)) {
//                 filterHierarchy(filtered_categories, categories[key].children, _key);
//             }
//         });
//         if (!Object.keys(categories[key].children).length) {
//             delete categories[key];
//         }
//     }
// };

// const gerHierarchy = (category, parentId, item) => {
//     if (category[parentId]) {
//         if (!category[parentId].children) {
//             category[parentId].children = {};
//         }
//         category[parentId].children[item.id] = {...item};
//     } else {
//         Object.values(category).forEach((child) => child.children && gerHierarchy(child.children, parentId, item));
//     }
//
//     return category;
// };

const save = (result) => {
    const src = './decoria.json';
    const root = FileSystem.findRoot();
    const path = dirname(src);

    FileSystem.mkdirP(resolve(root, path));
    const actualPath = resolve(root, src);

    fs.writeFileSync(actualPath, result);
};

module.exports = {
    start
};
