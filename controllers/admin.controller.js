const service = require('../service/admin');
const {promiseFn} = require('./promiseFn');

module.exports = {
    getMethod: (methodName) => (query) => promiseFn(service[methodName()], query)
};
