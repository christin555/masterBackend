const knex = require('../knex/index');
const service = require('../service');

const promiseFn = (fn, { res, ...restParams }) =>
    fn({ ...restParams, knex })
        .then((data) => res.json(data))
        .catch((err) => console.log(err));

module.exports = {
    getMethod: (methodName) => (query) => promiseFn(service[methodName()], query)
};
