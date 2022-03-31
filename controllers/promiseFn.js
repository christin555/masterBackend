const knex = require('../knex/index');
const {logger} = require('../parsers/utils/Logger');

module.exports = {
    promiseFn:  (fn, {res, ...restParams}) =>
        fn({...restParams, res, knex, logger})
            .then((data) => res.json(data))
            .catch((err) => {
                //чтобы не валился запрос
                console.log(err);
                res.status(err.status || 200);
                res.json({
                    error: {
                        errorCode: err.code, message: err.message
                    }
                });
            })
};
