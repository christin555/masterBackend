'use strict';

module.exports = {
    array2Object: (array, key = 'id') => {
        const result = {};

        array.forEach((item) => {
            if ((/\./).test(key)) {
                let newKey = item;

                key.split('.').forEach((itemKey) => {
                    if (itemKey in newKey) {
                        newKey = newKey[itemKey];
                    }
                });

                if (
                    typeof newKey === 'number' ||
                    typeof newKey === 'string' ||
                    typeof newKey === 'boolean'
                ) {
                    result[newKey] = item;
                }
            } else {
                result[item[key]] = item;
            }
        });

        return result;
    }
};
