'use strict'

const validateUsername = require('./validateUsername')
const validateEmail = require('./validateEmail')
const validatePassword = require('./validatePassword')

const validateRegister = (username, email, password)=> {
    if (validateUsername(username) || validateEmail(email) || validatePassword(password)) {
        return true
    }
    return false
}

module.exports = validateRegister