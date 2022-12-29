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
        Post.find({}, null, { skip: parseInt(page * 10), limit: 10, sort: { date: -1 } }, (error, docs) => {
            if (error) return res.status(500).send({ status: 'error', message: 'Ocurrio un error o no existen documentos' })
            return res.status(200).send({ status: 'success', docs })
        })
    },
    getUser: (req, res) => {
        let userId = req.params.userId
        let page = req.params.page
        Post.find({ "owner.id": userId }, null, { skip: parseInt(page * 10), limit: 10, sort: { date: -1 } }, (error, docs) => {
            if (error) {
                return res.status(500).send({ status: 'error', message: 'Ocurrio un error o no existen documentos' })
            }
            return res.status(200).send({ status: 'success', docs })
        })
    },
    findPost: (req, res) => {
        let search = req.body.search
        let limit = parseInt(req.body.limit)
        Post.find({ content: { $gte: search } }, (error, docs) => {
            if (error) {
                return res.status(500).send({ status: 'error', message: 'Ocurrio un error o no existen documentos' })
            }
            let result = []
            for (let count = 0; count < docs.length; count++) {
                if (docs[count].content.includes(search)) result.push(docs[count])
                if (limit == 1 && count == 6) break
            }
            return res.status(200).send({ status: 'success', docs: result })
        })
    },
    like: (req, res) => {
        let postId = req.params.postId
        let userId = req.params.userId
        User.findOne({ _id: userId }, (error, user) => {
            if (error) {
                return res.status(500).send({ status: 'error', message: 'Ocurrio un error o el usuario no es valido' })
            }
            Post.findOne({ _id: postId }, (err, doc) => {
                if (err) {
                    return res.status(500).send({ status: 'error', message: 'Ocurrio un error o el documento no es valido' })
                }
                let likeAction = true
                if (doc.likes.length > 0) {
                    for (let count = 0; count < doc.likes.length; count++) {
                        if (doc.likes[count].id == userId) {
                            likeAction = false
                            doc.likes.splice(count, 1)
                            break
                        }
                    }
                }
                if (likeAction) {
                    doc.likes.push({
                        id: userId,
                        username: user.username,
                        image: user.image
                    })
                }
                doc.save(saveErr => {
                    if (saveErr) {
                        return res.status(500).send({ status: 'error', message: 'Ocurrio un error al guardar' })
                    }
                    return res.status(200).send({ status: 'success', action: likeAction })
                })
            })
        })
    },
    comment: (req, res) => {
        let body = req.body
        User.findOne({ _id: body.userId }, (error, user) => {
            if (error) return res.status(500).send({ status: 'error', message: 'Ocurrio un error o el usuario no es valido' })
            Post.findOne({ _id: body.postId }, (err, doc) => {
                if (err) return res.status(500).send({ status: 'error', message: 'Ocurrio un error o el documento no es valido' })
                if (body.content.length == 0 || body.content.length > 200) return res.status(500).send({ status: 'error', message: 'El contenido no es valido' })
                doc.comments.push({
                    id: body.userId,
                    username: user.username,
                    image: user.image,
                    content: body.content
                })
                doc.save(saveErr => {
                    if (saveErr) return res.status(500).send({ status: 'error', message: 'Ocurrio un error al guardar' })
                    return res.status(200).send({ status: 'success', id: body.userId, username: user.username, image: user.image, content: body.content })
                })
            })
        })
    }
}

module.exports = controller