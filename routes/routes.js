'use strict'

const express = require('express');
const User = require('../controllers/user');
const multer = require('multer');
const upload = multer({ dest: 'public/images' })

let router = express.Router();

// Asignamos la ruta, el tipo de peticion y la funcion que se va a ejecutar al acceder
router.post('/auth', User.auth);
router.post('/new', User.new);
router.post('/updateNames', User.updateNames);
router.post('/upload', upload.single('image'), User.upload);

module.exports = router;
