const router = require('express-promise-router')();
const {getMethod} = require('../controllers/api.controller');

router.post('/catalog/getCatalog', getMethod(() => 'getCatalog'));
router.post('/catalog/getHierarchy', getMethod(() => 'getHierarchy'));
router.post('/catalog/countProducts', getMethod(() => 'countProducts'));
router.post('/catalog/getFilterFields', getMethod(() => 'getFilterFields'));

router.get('/products/get/:id', getMethod(() => 'getProduct'));

router.get('/parsing/startTarkett', getMethod(() => 'startTarkett'));
router.get('/parsing/startArteast', getMethod(() => 'startArteast'));
router.get('/parsing/startDeart', getMethod(() => 'startDeart'));
router.get('/parsing/startModuleo', getMethod(() => 'startModuleo'));
router.get('/parsing/startOptima', getMethod(() => 'startOptima'));
router.get('/parsing/startDecoria/:docid', getMethod(() => 'startDecoria'));
router.get('/parsing/startAlsa', getMethod(() => 'startAlsa'));
router.get('/parsing/startAlpine', getMethod(() => 'startAlpine'));

router.get('/articles/getArticles', getMethod(() => 'getArticles'));

router.post('/upload', (query) => getMethod('upload', query));

router.post('/send/callme', getMethod(() => 'callme'));

module.exports = router;
