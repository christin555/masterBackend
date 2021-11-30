const collections = (brandId) => {
    const data = [
        ['AGT Natura Line', 'Natura Line'],
        ['AGT Spark', 'Spark'],
        ['AGT Concept Neо', 'Concept Neo'],
        ['AGT Effect Premium', 'Effect Premium'],
        ['AGT Effect Elegance', 'Effect Elegance'],
        ['AGT Natura Slim', 'Natura Slim'],
        ['AGT Armonia (Natura) Slim', 'Armonia Slim'],
        ['AGT Armonia (Natura) Large', 'Armonia Large'],
        ['AGT Natura Ultra Line', 'Natura Ultra Line']
    ];

    return data.map(([nameDealer, name]) => {
        return {
            name,
            brandId,
            nameDealer,
        };
    });
};


exports.up = async (knex) => {
    const [{id}] = await knex('brands')
        .insert({name: 'AGT', weight: 2, alias: 'agt'})
        .onConflict(['name'])
        .merge()
        .returning(['id']);

    return Promise.all([
        knex.schema.alterTable('products', (table) => {
            table.string('ecologicalCertificate')
                .comment('Экологический сертификат');
            table.string('builtUnderlay')
                .comment('Встроенная подложка');
            table.string('needUnderlay')
                .comment('нужна Подложка');
            table.string('material')
                .comment('Основной материал');
        }),
        knex('collections')
            .insert(collections(id))
            .onConflict(['name', 'brandId'])
            .merge(),
    ]);
};

exports.down = (knex) => {
    return Promise.all([
        knex.schema.alterTable('products', (table) => {
            table.dropColumns([
                'material',
                'needUnderlay',
                'builtUnderlay',
                'ecologicalCertificate'
            ]);
        }),
        knex.schema.alterTable('collections', (table) => {
            table.dropColumns(['priceName']);
        })
    ]);
};
