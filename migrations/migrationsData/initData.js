const categories = [
    {
        name: 'Двери',
        level: 1,
        alias: 'doors',
        isLast: true,
        img: 'https://www.union.ru/upload/iblock/cc2/c39aaa1f8c18249c8414f55c0a9aed9b76adcbc2.jpg'
    },
    {
        name: 'Напольные покрытия',
        level: 1,
        alias: 'floors',
        isLast: false,
        img: 'https://dillmart.ru/images/stories/virtuemart/product/alpi-coliseumgres.jpg'
    },
    {
        name: 'Ламинат',
        level: 2,
        alias: 'laminate',
        isLast: true,
        img: 'https://newmix.ru/upload/iblock/7dd/7dd4ef75faf362dc97b237ed7821e79b.jpg'
    },
    {
        name: 'Керамогранит',
        level: 2,
        alias: 'keramogranit',
        isLast: false,
        img: 'https://baupartner.ru/upload/iblock/1b6/1b68681211abff21a2a2f6ef7764fe53.jpg'
    },
    {
        name: 'Кварцвиниловая плитка',
        level: 2,
        alias: 'quartzvinyl',
        isLast: false,
        img: 'https://sankeram.ru/upload/iblock/fa0/DSC_5507.jpg'
    },
    {
        name: 'Замковая',
        level: 3,
        alias: 'quartzvinyl_zamkovay',
        isLast: true,
        img: 'https://polmodern.ru/media/Statia%20KvarzVinil/kvarc-vinilovaya-plitka-dlya-pola-15.jpg'
    },
    {
        name: 'Клеевая',
        level: 3,
        alias: 'quartzvinyl_kleevay',
        isLast: true,
        img: 'https://fontanero.com.ua/wp-content/uploads/2021/07/vinil.jpg'
    },
    {
        name: 'Спортивные покрытия',
        level: 2,
        alias: 'sport',
        isLast: true,
        img: 'https://www.tarkett.ru/media/img/large/IN_TEE_OMNISPORTS_V65.jpg'
    }
];

const collections = [
    //deart
    {
        name: 'DeART Strong',
        brand: 'deart'
    },
    {
        name: 'DeART Eco Click',
        brand: 'deart'
    },
    {
        name: 'DeART Lite',
        brand: 'deart'
    },
    {
        name: 'DeART Optim',
        brand: 'deart'
    },

    //arteast
    {
        name: 'ART STONE ARMOR',
        brand: 'arteast'
    },
    {
        name: 'ART STONE OPTIMA',
        brand: 'arteast'
    },
    {
        name: 'ART STONE STANDARD',
        brand: 'arteast'
    },
    {
        name: 'ART STONE',
        brand: 'arteast'
    },
    {
        name: 'ART STONE AIRY',
        brand: 'arteast'
    },
    {
        name: 'ART TILE HIT',
        brand: 'arteast'
    },
    {
        name: 'ART TILE FIT',
        brand: 'arteast'
    },
    {
        name: 'ART TILE HIT S',
        brand: 'arteast'
    },


    //moduleo
    {
        name: 'SELECT',
        nameDealer: 'Moduleo Select',
        priceName: 'SELECT CLICK',
        brand: 'moduleo'
    },
    {
        name: 'TRANSFORM',
        nameDealer: 'Moduleo Transform',
        priceName: 'TRANSFORM CLICK',
        brand: 'moduleo'
    },
    {
        name: 'IMPRESS',
        nameDealer: 'Moduleo Impress',
        priceName: 'IMPRESS CLICK',
        brand: 'moduleo'
    },
    {
        name: 'PARQUETRY',
        nameDealer: 'Moduleo Parquetry',
        priceName: 'PARQUETRY short plank',
        brand: 'moduleo'
    },

    //оптима порте
    {
        name: 'Парма',
        brand: 'optima',
        category: 'doors'
    },
    {
        name: 'Турин',
        brand: 'optima',
        category: 'doors'
    },
    {
        name: 'Тоскана',
        brand: 'optima',
        category: 'doors'
    },
    {
        name: 'Сицилия',
        brand: 'optima',
        category: 'doors'
    },

    //tarkett
    {name: 'Nordica New', nameDealer: 'Nordica New', brand: 'tarkett'},
    {name: 'Navigator', nameDealer: 'Navigator', brand: 'tarkett'},
    {name: 'Gallery', nameDealer: 'Gallery', brand: 'tarkett'},
    {name: 'Gallery Mini', nameDealer: 'Gallery Mini', brand: 'tarkett'},
    {name: 'Dynasty', nameDealer: 'Dynasty', brand: 'tarkett'},
    {name: 'Pilot', nameDealer: 'Pilot', brand: 'tarkett'},
    {name: 'Poem', nameDealer: 'Poem', brand: 'tarkett'},
    {name: 'Estetica', nameDealer: 'Estetica', brand: 'tarkett'},
    {name: 'Ballet', nameDealer: 'Ballet', brand: 'tarkett'},
    {name: 'Cruise', nameDealer: 'Cruise', brand: 'tarkett'},
    {name: 'Cinema', nameDealer: 'Cinema', brand: 'tarkett'},
    {name: 'Intermezzo', nameDealer: 'Intermezzo', brand: 'tarkett'},
    {name: 'Woodstock Family', nameDealer: 'Woodstock Family', brand: 'tarkett'},
    {name: 'Robinson', nameDealer: 'Robinson', brand: 'tarkett'},
    {name: 'Fiesta', nameDealer: 'Fiesta', brand: 'tarkett'},
    {name: 'Holiday', nameDealer: 'Holiday', brand: 'tarkett'},
    {name: 'Germany', nameDealer: 'Germany', brand: 'tarkett'},
    {name: 'France', nameDealer: 'France', brand: 'tarkett'},
    {name: 'Первая Сибирская', nameDealer: 'Первая Сибирская', brand: 'tarkett'},
    {name: 'Первая Уральская', nameDealer: 'Первая Уральская', brand: 'tarkett'},
    {name: 'VERNISSAGE', nameDealer: 'VERNISSAGE', brand: 'tarkett'},
    {name: 'WOODSTOCK Pr.', nameDealer: 'WOODSTOCK Pr.', brand: 'tarkett'},
    //спорт покрытия
    {name: 'MULTIFLEX M', brand: 'tarkett'},
    {name: 'OMNISPORTS R35', brand: 'tarkett'},
    {name: 'OMNISPORTS R65', brand: 'tarkett'},
    {name: 'OMNISPORTS R83', brand: 'tarkett'},

    //alpinefloor
    {name: 'Stone', brand: 'alpine'},
    {name: 'Classic', brand: 'alpine'},
    {name: 'Expressive', brand: 'alpine'},
    {name: 'Grand Sequoia', brand: 'alpine'},
    {name: 'Parquet Light', brand: 'alpine'},
    {name: 'Sequoia', brand: 'alpine'},
    {name: 'Intense', brand: 'alpine'},
    {name: 'Easy Line', brand: 'alpine'}

];


const articles = [
    {
        content: 'Если вы хотите создать неповторимый и особенный интерьер в своём доме приглашаем вас в наш салон удивиться насколько разнообразным может быть выбор дизайнов для стен.\\n\n' +
            '\n' +
            '\\nС выбором сюжетов вам помогут специалисты нашего салона. Гарантируем что Вы точно останетесь довольны результатом. Мы работаем только с самыми лучшими производителями, которые популярны не только в России, но и во всем мире.\n' +
            '⁣⁣⠀\n' +
            'С уверенностью гарантируем, что высокое качество нашего товара будет радовать вас долгие годы.\\n\n' +
            'Наши специалисты имеют многолетний опыт и профессионально выполнят весь комплекс работ.\\n\n' +
            'Гарантия на выполненные работы до 3 лет.\\n',
        title: 'ФРЕСКИ || AFFRESCO'
    },
    {
        content: 'Выполнили монтаж бельгийского ковролина премиум класса на объекте в районе Цымлянское.\\n\n' +
            'Во время работы был произведен плотный рез вдоль стен, для фиксации применялся клей фиксатор Arlok 39\\n\n' +
            '\n' +
            'На сегодняшний день AW masquerade является самым лучшим ковровым покрытием во всем мире\\n\n' +
            '✅ Высокая износоустойчивость за счет полиамидного ворса\\n\n' +
            '✅ Устойчивость краски к любым химическим средствам\\n\n' +
            '✅ Наличие войлока для дополнительной мягкости\\n\n' +
            '✅ Обладает антибактериальными и гипоаллергенными средствами\\n\n' +
            '✅ Впитывает минимум пыли\\n\n' +
            '✅ Прогнозируемый срок службы до 20\\n\n',
        title: 'Укладка ковролина AW MASQUERADE'
    },
    {
        content: 'Рассказываем о важных критериях выбора, которые помогут подобрать то, что нужно⁣⁣⠀\\n\n' +
            '⁣⁣⠀\n' +
            '▪ ️Назначение помещения, где будет эксплуатироваться напольное покрытие (квартира, дом или коммерческое помещение с высокой проходимостью и т.д.)⁣⁣⠀⠀\\n\n' +
            '▪ ️Наличие системы «тёплого пола» и других источников отопления⁣⁣⠀⠀\\n\n' +
            '▪ ️Предпочтения («мягкость» или «твёрдость» стука при эксплуатации)⁣⁣⠀⠀\\n\n' +
            '▪ ️Цветовая гамма⁣⁣⠀⠀\\n\n' +
            '▪ ️Заложенный бюджет⁣⁣⠀⠀\\n\n' +
            '  ⁣⁣⠀\n' +
            'Мы с особым профессионализмом подберём для Вас самый лучший вариант🤝⁣⁣⠀⠀\\n\n' +
            'Вы забудете о ремонте на долгие годы, приобретая напольные покрытия и услуги у нас️⠀\\n',
        title: '💡⁣⁣⠀Как выбрать напольное покрытие?'
    },
    {
        content: 'Пробковое покрытие — это натуральный материал, отвечающий всем требованиям экологичности. Пробковое покрытие пола или отделка стен создаст в Вашей комнате комфорт, стиль и оригинальность дизайна \\n \n' +
            '✅ 100% водостойкость. Стеновые панели состоят из цельного полотна прессованной пробки: 0% изменение толщины при прямом контакте с водой в течение суток и дольше \\n \n' +
            '✅ Звукоизоляция. Пробковые покрытия снижают уровень шума в помещениях, изолируя вас от внешних шумов и окружающую среду от вас. Это особенно актуально для спален и детских комнат \\n\n' +
            '✅ Пробка — лучший природный теплоизолятор. В отличие от любых других настенных покрытий, пробка имеет комнатную температуру: прекрасно сохраняет тепло зимой и прохладу летом \\n\n' +
            '✅ Экологичность.Пробка абсолютно безвредна для здоровья человека.',
        title: 'ПРОБКОВОЕ ПОКРЫТИЕ'
    }
];

const media = [
    {entity: 3, entityId: 1, src: 'wHxlaxkd8cU', type: 'youtube'},
    {entity: 3, entityId: 2, src: 'nsV6WbbXjtg', type: 'youtube'},
    {entity: 3, entityId: 3, src: 'BG-tTfV6DLw', type: 'youtube'},
    {
        entity: 3,
        entityId: 4,
        src: 'https://sun9-40.userapi.com/impg/dozkbEqPBbhtAmr_GzDJbSTI-FQpC61ZFFgo5w/N56rVPhZuNE.jpg?size=750x750&quality=96&sign=d9e2b6566907a9346572bdc232a4a8a3&type=album',
        type: 'img'
    }
];

const catalogs = [
    {
        name: 'quartzvinylCardFields',
        title: 'Поля карточки кварцвинила'
    },
    {
        name: 'filterFields',
        title: 'Поля фильтра'
    }
];

const catalogItems = [
    {
        name: 'quartzvinylCardFields',
        items: [
            {name: 'householdGuarantee', title: 'Гарантия при бытовом применении', type: 'isMain'},
            {name: 'protectiveLayer', title: 'Защитный слой'},
            {name: 'resistanceClass', title: 'Класс нагрузки', type: 'isChip', icon: 'Apartment'},
            {name: 'fireClass', title: 'Класс пожарной опасности'},
            {name: 'totalThickness', title: 'Общая толщина'},
            {name: 'withHeatingFloor', title: 'Применение с подогревом полов'},
            {name: 'size', title: 'Размеры', type: 'isMain'},
            {name: 'connectionType', title: 'Способ монтажа', type: 'isChip', icon: 'DoneAll'},
            {name: 'format', title: 'Формат'},
            {name: 'surfaceTexture', title: 'Текстура поверхности'},
            {name: 'specials', title: 'Особенности'},
            {name: 'soundproofing', title: 'Звукоизоляция'},
            {name: 'country', title: 'Страна производства'},
            {name: 'guarantee', title: 'Гарантия'},
            {name: 'packageWeight', title: 'Вес 1 упаковки'},
            {name: 'metersInPackage', title: 'Кол-во кв.м. в упаковке'},
            {name: 'itemsInPackage', title: 'Количество штук в упаковке'},
            {name: 'chamfer', title: 'Фаска', type: 'isMain'},
            {name: 'thickness', title: 'Толщина плитки мм', type: 'isMain'},
            {name: 'fixationType', title: 'Тип фиксации'},
            {name: 'tileType', title: 'Вид плитки'},
            {name: 'texture', title: 'Фактура'},
            {name: 'surface', title: 'Поверхность'},
            {name: 'using', title: 'Применение', type: 'isChip'},
            {name: 'color', title: 'Оттенок', type: 'isMain'},
            {name: 'collection', title: 'Коллекция'},
            {name: 'substrateThickness', title: 'Толщина подложки мм'},
            {name: 'height', title: 'Высота мм'},
            {name: 'width', title: 'Ширина мм'},
            {name: 'length', title: 'Длина мм'},
            {name: 'link3d', title: 'Материалы для визуализации', type: 'isMain'},

            //ламинат
            {name: 'colorName', title: 'Цвет', type: 'isMain'},
            {name: 'abrasionResistance', title: 'Сопротивление истираемости (AC)'},
            {name: 'constructionProcess', title: 'Способ производства'},
            {name: 'furnitureLegEffect', title: 'Устойчивость к воздействию ножек мебели и каблуков', type: 'isMain'},
            {name: 'baseBoard', title: 'Плотность плиты'},
            {name: 'residentialWarranty', title: 'Срок службы в общественных помещениях', type: 'isChip'},
            {name: 'professionalWarranty', title: 'Срок службы в жилых помещениях', type: 'isChip'}
        ]
    },
    {
        name: 'filterFields',
        items: [
            {
                id: 1,
                name: 'collectionId',
                title: 'Коллекция',
                type: 'checkbox',
                values: {
                    name: 'collections',
                    entity: 'table',
                    filterBy: ['brandId', 'categoryId']
                }
            },
            {
                id: 2,
                name: 'brandId',
                title: 'Бренд',
                type: 'checkbox',
                values: {
                    name: 'brands',
                    entity: 'table'
                }
            },
            {
                id: 3,
                name: 'finishingMaterial',
                title: 'Материал отделки',
                type: 'checkbox',
                values: {
                    name: 'finishingMaterialDoors',
                    entity: 'table'
                }
            }
        ]
    }
];

const conditions = [
    {catalog: 'filterFields', category: 'doors', fields: [1, 3]},
    {catalog: 'filterFields', category: 'floors', fields: [1, 2]}
];

const brands = [
    {
        name: 'Moduleo',
        alias: 'moduleo',
        weight: 6
    },
    {
        name: 'ART EAST',
        alias: 'arteast',
        weight: 5
    },
    {
        name: 'Оптима Порте',
        alias: 'optima'
    },
    {
        name: 'DEART',
        alias: 'deart',
        weight: 4
    },
    {
        name: 'Tarkett',
        alias: 'tarkett',
        weight: 3
    },
    {
        name: 'Alpine Floor',
        alias: 'alpine',
        weight: 2
    }
];

const hierarchy = [
    {
        head: 'floors',
        under: ['laminate', 'keramogranit', 'quartzvinyl', 'sport']
    },
    {
        head: 'quartzvinyl',
        under: ['quartzvinyl_zamkovay', 'quartzvinyl_kleevay']
    }
];

const finishingMaterialDoors = [
    {name: 'Венге FL ЭКО-шпон', img: 'http://www.optimaporte.ru/assets/pictures/catalog/ekoshpon_venge.jpg'},
    {name: 'Дуб беленый FL ЭКО-шпон', img: 'http://www.optimaporte.ru/assets/pictures/catalog/ekoshpon_dub_bel.jpg'},
    {name: 'Дуб серый FL ЭКО-шпон', img: 'http://www.optimaporte.ru/assets/pictures/catalog/ekoshpon_dub_ser.jpg'},
    {name: 'Ясень перламутровый FL', img: 'http://www.optimaporte.ru/assets/pictures/catalog/ekoshpon_yasen_pearl.jpg'},
    {name: 'Ясень серебристый FL', img: 'http://www.optimaporte.ru/assets/pictures/catalog/yasen_serebr.jpg'},
    {name: 'Белый лёд ЭКО-шпон', img: 'http://www.optimaporte.ru/assets/pictures/catalog/ekoshpon_bel.jpg'}
];

module.exports = {
    categories,
    collections,
    catalogItems,
    catalogs,
    hierarchy,
    finishingMaterialDoors,
    brands,
    conditions,
    articles,
    media
};
