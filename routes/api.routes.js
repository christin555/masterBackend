const router = require('express-promise-router')();
const {getMethod} = require('../controllers/api.controller');

router.post('/catalog/getCatalog', getMethod(() => 'getCatalog'));
router.post('/catalog/getHierarchy', getMethod(() => 'getHierarchy'));
router.post('/catalog/countProducts', getMethod(() => 'countProducts'));
router.post('/catalog/getFilterFields', getMethod(() => 'getFilterFields'));

router.get('/products/get/:alias', getMethod(() => 'getProduct'));
router.post('/products/getPopular', getMethod(() => 'getPopular'));

router.post('/services/get', getMethod(() => 'getServices'));
router.post('/works/get', getMethod(() => 'getWorks'));
router.post('/work/get', getMethod(() => 'getWork'));

router.post('/articles/getArticles', getMethod(() => 'getArticles'));
router.post('/article/get', getMethod(() => 'getArticle'));

router.post('/upload', (query) => getMethod('upload', query));

router.get('/getLinks', getMethod(() => 'getLinks'));

router.post('/send/callme', getMethod(() => 'callme'));

router.post('/seo/getHeaders', getMethod(() => 'getHeaders'));

module.exports = router;
