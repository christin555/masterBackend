exports.up = (knex) => {
    return knex.schema.alterTable('products', (table) => {
        table.string('waterResistant')
            .comment('Влагостойкий');

        table.string('antibacterial')
            .comment('Антибактериальные свойства плитки');

        table.string('antislip')
            .comment('Антискользящие свойства');

        table.string('antistatic')
            .comment('Антистатический');

        table.string('ecofriendly')
            .comment('Экологичный');

        table.string('formaldehydeEmissionClass')
            .comment('Класс эмиссии формальдегида');

        table.string('packageVolume')
            .comment('Объем упаковки');

        table.string('designer')
            .comment('Дизайнерский');
    });
};

exports.down = (knex) => {
    return knex.schema.alterTable('products', (table) => {
        table.dropColumns([
            'waterResistant',
            'antibacterial',
            'antislip',
            'antistatic',
            'ecofriendly',
            'formaldehydeEmissionClass',
            'packageVolume',
            'designer'
        ]);
    });
};
