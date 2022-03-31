const router = require('express-promise-router')();
const {getMethod} = require('../controllers/admin.controller');

router.post('/getPricesProducts', getMethod(() => 'getPricesProducts'));
router.post('/updatePrices', getMethod(() => 'updatePrices'));
router.post('/deleteProducts', getMethod(() => 'deleteProducts'));
router.get('/categories/get', getMethod(() => 'getCategories'));
router.post('/getFields', getMethod(() => 'getFields'));
router.post('/addObject', getMethod(() => 'addObject'));

module.exports = router;
