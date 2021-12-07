const router = require('express-promise-router')();
const {getMethod} = require('../controllers/api.controller');

router.post('/catalog/getCatalog', getMethod(() => 'getCatalog'));
router.post('/catalog/getHierarchy', getMethod(() => 'getHierarchy'));
router.post('/catalog/countProducts', getMethod(() => 'countProducts'));
router.post('/catalog/getFilterFields', getMethod(() => 'getFilterFields'));

router.get('/products/get/:alias', getMethod(() => 'getProduct'));
router.post('/products/getPopular', getMethod(() => 'getPopular'));

router.get('/articles/getArticles', getMethod(() => 'getArticles'));
router.post('/article/get', getMethod(() => 'getArticle'));

router.post('/upload', (query) => getMethod('upload', query));

router.post('/send/callme', getMethod(() => 'callme'));

module.exports = router;
