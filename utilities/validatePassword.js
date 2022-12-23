// No puede tener espacios ni mas de 20 caracteres. Debe contener al menos 8 caracteres, 1 minuscula, 1 mayuscula y 1 numero
const validatePassword = (password)=> {
    if (password.length < 8 || password.length > 20 || /\s/g.test(password) || /\W/g.test(password) || !/[a-z]/g.test(password) || !/[A-Z]/g.test(password) || !/[0-9]/g.test(password)) {
        return true
    }
    return false
}

module.exports = validatePassword