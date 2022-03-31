const service = require('../service');
const {promiseFn} = require('./promiseFn');

module.exports = {
    getMethod: (methodName) => (query) => promiseFn(service[methodName()], query)
};
