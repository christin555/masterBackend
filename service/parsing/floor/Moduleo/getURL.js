

module.exports = {
    getURL: async ({collections}) => {
        const collLinked = encodeURI(decodeURI(collections.map(({nameDealer}) => nameDealer.toLowerCase()).join(',')));

        return `https://www.moduleo.com/ru-ru/%D0%BA%D0%B2%D0%B0%D1%80%D1%86%D0%B2%D0%B8%D0%BD%D0%B8%D0%BB%D0%BE%D0%B2%D0%B0%D1%8F-%D0%BF%D0%BB%D0%B8%D1%82%D0%BA%D0%B0?filter=collectionname.eq.any(${collLinked})&page=4&page_size=80&view_size=80`;
    }
};

