'use strict'

const Post = require('../models/post');
const User = require('../models/user')
const fs = require('fs');

const controller = {
    new: (req, res) => {
        let body = req.body
        if (!body.content && !req.file) {
            return res.status(500).send({ status: 'error', message: 'Publicacion sin contenido' })
        } else if (!body.userId || !body.username) {
            return res.status(500).send({ status: 'error', message: 'Faltan datos del usuario' })
        } else if (body.content && body.content.length > 600) {
            return res.status(500).send({ status: 'error', message: 'El contenido del post es mayor a 600 caracteres' })
        }
        User.findOne({ _id: body.userId }, (err, user) => {
            if (err) {
                return res.status(500).send({ status: 'error', message: 'La ID del usuario no es valida' })
            } else if (user.username !== body.username) {
                return res.status(500).send({ status: 'error', message: 'Los datos de usuario no coinciden' })
            }
            let post = new Post()
            post.owner.id = body.userId
            post.owner.username = body.username
            post.owner.image = body.image ? body.image : ''
            if (body.content) {
                post.content = body.content
            }
            if (req.file) {
                if (req.file.mimetype.split('/')[1] !== 'png' && req.file.mimetype.split('/')[1] !== 'jpeg' && req.file.mimetype.split('/')[1] !== 'webp') {
                    return res.status(500).send({ status: 'error', message: 'Archivo invalido'  })
                }
                fs.renameSync(req.file.path, req.file.path + '.' + req.file.mimetype.split('/')[1])
                post.image = 'http://localhost:3900/images/' + req.file.filename + '.' + req.file.mimetype.split('/')[1]
            }
            post.save(error => {
                if (error) return res.status(500).send({ status: 'error', message: 'Ocurrio un error al guardar' })
                return res.status(200).send({ status: 'success', post })
            })
        })
    },
    get: (req, res) => {
        let page = req.params.page
        Post.find({}, null, { skip: parseInt(page * 10), limit: 10, sort: '-date' }, (error, docs) => {
            if (error) return res.status(500).send({ status: 'error', message: 'Ocurrio un error o no existen documentos' })
            return res.status(200).send({ status: 'success', docs })
        })
    }
}

module.exports = controller