export const validateUsername = (username)=> {
    let response = {
        error: true
    }
    if (username.includes(' ')) {
        response.message = 'El usuario no puede contener espacios en blanco'
        return response
    } else if (username.length < 6 || username.length > 16) {
        response.message = 'El usuario debe tener minimo 6 digitos y maximo 16'
        return response
    } else if (/\W/g.test(username)) {
        response.message = 'El usuario no puede contener caracteres especiales'
        return response
    }
    response.error = false
    return response
}