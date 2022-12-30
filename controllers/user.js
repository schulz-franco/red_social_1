'use strict'

const User = require('../models/user');
const fs = require('fs');
const validateRegister = require('../utilities/validateAll')
const validateName = require('../utilities/validateName')


let controller = {
    new: async (req, res) => {
        let { username, email, password } = req.body;

        if (validateRegister(username, email, password)) {
            return res.status(500).send({ status: 'error', message: 'Ocurrio un error, intente recargar la pagina' })
        }

        let user = new User();
        user.username = username.toLowerCase();
        user.email = email.toLowerCase();
        user.password = password;

        User.findOne({ username }, (error, usernameExist)=> {
            if (usernameExist) {
                return res.status(500).send({ status: 'error', message: 'El nombre de usuario ya existe' })
            } else {
                User.findOne({ email }, (error, emailExist)=> {
                    if (emailExist) {
                        return res.status(500).send({ status: 'error', message: 'Ese email ya esta en uso' })
                    } else {
                        user.save((err) => {
                            if (err) {
                                return res.status(404).send({
                                    status: 'error',
                                    message: 'Ocurrio un error'
                                });
                            } else {
                                return res.status(200).send({
                                    status: 'success',
                                    username
                                });
                            }
                        }); 
                    }
                })
            }
        })
    },
    auth: async (req, res) => {
        const { email, password } = req.body;
        User.findOne({ email: email.toLowerCase() }, (error, user)=> {
            if (error) {
                return res.status(500).send({ status: 'error', message: 'Ocurrio un error' });
            } else if (!user) {
                return res.status(500).send({ status: 'error', message: 'Email o contraseña incorrectos' });
            }
            user.correctPassword(password, (err, result)=> {
                if (err) {
                    res.status(500).send({ status: 'error', message: 'Ocurrio un error' });
                } else if (result) {
                    res.status(200).send({
                        id: user._id,
                        username: user.username,
                        email: email.toLowerCase(),
                        name: user.name,
                        lastname: user.lastname,
                        role: user.role,
                        genre: user.genre,
                        image: user.image,
                        firstTime: user.firstTime
                    });
                } else {
                    res.status(500).send({ status: 'error', message: 'Email o contraseña incorrectos' })
                }
            })
        })
    },
    updateNames: async (req, res) => {
        const body = req.body
        if (validateName(body.name) || validateName(body.lastname)) {
            return res.status(500).send({ status: 'error', message: 'Nombre o apellido no validos' })
        }
        if (body.genre !== 0 && body.genre !== 1) {
            return res.status(500).send({ status: 'error', message: 'Ocurrio un error, intente recargar la pagina' })
        }
        User.findOne({ email: body.email.toLowerCase() }, (error, user) => {
            if (error) {
                return res.status(500).send({ status: 'error', message: 'Ocurrio un error' });
            } else if (!user) {
                return res.status(500).send({ status: 'error', message: 'El usuario no existe' });
            }
            user.name = body.name.toLowerCase()
            user.lastname = body.lastname.toLowerCase()
            user.genre = body.genre
            user.firstTime = 1
            user.save(err => {
                if (err) return res.status(500).send({ status: 'error', message: 'Ocurrio un error al guardar' })
                return res.status(200).send({ status: 'success', message: 'Datos actualizados con exito' })
            })
        })
    },
    upload: async (req, res) => {
        if (req.file.mimetype.split('/')[1] !== 'png' && req.file.mimetype.split('/')[1] !== 'jpeg' && req.file.mimetype.split('/')[1] !== 'webp') {
            return res.status(500).send({ status: 'error', message: 'Archivo invalido'  })
        }
        fs.renameSync(req.file.path, req.file.path + '.' + req.file.mimetype.split('/')[1])
        User.findOne({ email: req.body.email.toLowerCase() }, (error, user) => {
            if (error) {
                return res.status(500).send({ status: 'error', message: 'Ocurrio un error' });
            } else if (!user) {
                return res.status(500).send({ status: 'error', message: 'El usuario no existe' });
            }
            let imagePath = 'http://localhost:3900/images/' + req.file.filename + '.' + req.file.mimetype.split('/')[1]
            user.image = imagePath
            user.save(err => {
                if (err) return res.status(500).send({ status: 'error', message: 'Ocurrio un error al guardar' })
                return res.status(200).send({ status: 'success', message: 'Imagen actualizada con exito', imagePath})
            })
        })
    },
    getUser: (req, res) => {
        let userId = req.params.userId
        User.findOne({ _id: userId }, (error, user) => {
            if (error) return res.status(404).send({ status: 'error', message: 'La id del usuario no es valida' })
            return res.status(200).send({ status: 'success', user })
        })
    }
}

module.exports = controller;