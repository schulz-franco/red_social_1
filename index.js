'use strict'

const express = require('express');
const app = express();
const port = 3900;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const url = 'mongodb://localhost:27017/NOMBRE_PROYECTO';

mongoose.Promise = global.Promise;

let routes = require('./routes/routes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/api', routes);

app.use('/', express.static(path.join(__dirname, 'build')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

mongoose.connect(url, { useNewUrlParser: true }).then(() =>{
	app.listen(process.env.PORT || port, () =>{
		console.log('Servidor ejecutándose en http://localhost:' + port );
	});
});
