const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const auth = require('./auth');

const fileUpload = require('express-fileupload');
const apiRoute = require('./routes/api.routes');
const authRoute = require('./routes/auth.routes');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.json({type: 'application/vnd.api+json'}));
app.use(cors());
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));
app.use('/api/', apiRoute);

app.listen(8800, function () {
    console.log('API app started');
});

module.exports = app;
