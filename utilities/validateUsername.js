const validateUsername = (username)=> {
    if (username.includes(' ') || username.length < 6 || username.length > 16 || /\W/g.test(username)) {
        return true
    }
    return false
}

module.exports = validateUsername