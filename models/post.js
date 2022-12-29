'use strict'

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostSchema = new Schema({
    owner: {
        id: { type: String, required: true },
        username: { type: String, required: true },
        image: { type: String }
    },
    content: { type: String },
    image: { type: String },
    likes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema)