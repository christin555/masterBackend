//потом будет еще выгрузыка в фиды яндекс
const parser = process.argv.slice(2);

require(`./${parser}`).start();