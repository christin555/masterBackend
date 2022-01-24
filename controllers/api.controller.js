const knex = require('../knex/index');
const service = require('../service');

const promiseFn = (fn, {res, ...restParams}) =>
    fn({...restParams, res, knex})
        .then((data) => res.json(data))
        .catch((err) => {
            res.status(err.status || 500);
            res.json({errorCode: err.errorCode, message: err.message});
        });

module.exports = {
    getMethod: (methodName) => (query) => promiseFn(service[methodName()], query)
};
