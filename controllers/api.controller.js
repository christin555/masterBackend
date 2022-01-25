const knex = require('../knex/index');
const service = require('../service');

const promiseFn = (fn, {res, ...restParams}) =>
    fn({...restParams, res, knex})
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
        });

module.exports = {
    getMethod: (methodName) => (query) => promiseFn(service[methodName()], query)
};
