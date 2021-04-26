const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const connection = require('./helpers/DBConnection');
const ServiceControllers = require('./controllers/ServiceControllers');
const ServiceModels = require('./models/ServiceModels');
const ServiceRoute = require('./routes/ServiceRoutes');
const md5 = require('md5');
const fs = require('fs');


const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(morgan('combined'));

ServiceRoute.routesConfig(app);

const crypto = require("crypto");

const id = crypto.randomBytes(3).toString("hex");

console.log(id);

app.listen(3400, () => {
    console.log('Server Is Running!');
});