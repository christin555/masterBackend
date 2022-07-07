const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const auth = require('./auth');

const fileUpload = require('express-fileupload');
const apiRoute = require('./routes/api.routes');
const authRoute = require('./routes/auth.routes');
const adminRoute = require('./routes/admin.routes');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.json({type: 'application/vnd.api+json'}));
app.use(cors({
//  origin: ['https://admin.master-pola.com/', 'https://master-pola.com'],
 // optionsSuccessStatus: 200
}));
app.use(fileUpload());

app.use('/auth/', authRoute);
app.use('/public', express.static(__dirname + '/public'));
app.use('/api/', apiRoute);
app.use('/admin/', auth.verifyToken, adminRoute);

app.listen(8800, function () {
    console.log('API app started');
});

module.exports = app;
