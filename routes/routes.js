'use strict'

const express = require('express');
const User = require('../controllers/user');
const Post = require('../controllers/post');
const multer = require('multer');
const upload = multer({ dest: 'public/images' })

let router = express.Router();

router.post('/auth', User.auth);
router.post('/new', User.new);
router.post('/updateNames', User.updateNames);
router.post('/upload', upload.single('image'), User.upload);
router.get('/user/get/:userId', User.getUser)

router.get('/post/get/:page', Post.get);
router.get('/post/one/get/:postId', Post.getPost)
router.get('/post/user/get/:userId/:page', Post.getUser);
router.post('/post/find', Post.findPost);
router.post('/post/new', upload.single('image'), Post.new);
router.post('/post/like/:postId/:userId', Post.like);
router.post('/post/comment', Post.comment)

module.exports = router;