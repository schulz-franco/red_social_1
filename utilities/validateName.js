const validateName = (name)=> {
    if (name.includes(' ') || name.length > 16 || /\W/g.test(name) || /[0-9]/g.test(name)) {
        return true
    }
    return false
}

module.exports = validateName