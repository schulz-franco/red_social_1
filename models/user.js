'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: 0 },
    name: { type: String },
    lastname: { type: String },
    genre: { type: Number, default: 0 },
    image: { type: String },
    firstTime: { type: Number, default: 0 }
});

UserSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
        const doc = this;
        bcrypt.hash(doc.password, 1, function (error, hashed) {
            if (error) {
                next(error);
            } else {
                doc.password = hashed;
                next();
            }
        })
    } else {
        next();
    }
})

UserSchema.methods.correctPassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, res) {
        if (error) {
            callback(error);
        } else {
            callback(error, res);
        }
    });
}

module.exports = mongoose.model('User', UserSchema);