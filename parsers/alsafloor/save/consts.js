const COLLECTION_IDX = 1;
const CODE_IDX = 2;

const collectionMatch = {
    'Creative': 'Herringbone'
};

// Свойства которые надо удалить
// Делаем объектом, т.к. это быстрее чем цикл
const delProps = {
    'Скидка': true,
    'Фаска': true,
    'Цена оптовая': true,
    'Цена розницы': true,
    'Класс': true,
    'Гарантия завода производителя 25 лет;': true,
    'Исполнение ламели однополосное с фаской.': true,
    'Размеры доски': true,
    'Количество в упаковке': true,
    'Гарантия завода производителя': true,
    'Гарантия завода производителя 25 лет': true,
    'Производитель': true
};

const propsToDB = {
    'Коллекция': 'collection',
    'Размеры': 'size',
    'Страна': 'country',
    'Порода дерева': 'surfaceTexture',
    'Тип соединения': 'connectionType',
    'Влагостойкий': 'waterResistant',
    'Наличие фаски': 'chamfer',
    'Дизайн': 'texture',
    'Шумоизоляция': 'soundproofing',
    'Количество кв.м. в ед. упаковки': 'metersInPackage',
    'Количество штук в упаковке': 'itemsInPackage',
    'Сопротивление истираемости': 'abrasionResistance',
    'Антибактериальные свойства плитки': 'antibacterial',
    'Антискользящие свойства': 'antislip',
    'Антистатический': 'antistatic',
    'Экологичный': 'ecofriendly',
    'Класс эмиссии формальдегида': 'formaldehydeEmissionClass',
    'Класс пожаробезопасности': 'fireClass',
    'Гарантия производителя': 'guarantee',
    'Артикул': 'code',
    'Толщина': 'thickness',
    'Тон': 'color',
    'Класс ламината': 'resistanceClass',
    'Объем упаковки': 'packageVolume',
    'Вес упаковки': 'packageWeight',
    'Теплый пол': 'withHeatingFloor',
    'Дизайнерский': 'designer'
};

module.exports = {
    propsToDB,
    delProps,
    collectionMatch,
    CODE_IDX,
    COLLECTION_IDX
};