// No puede tener espacios ni mas de 20 caracteres. Debe contener al menos 8 caracteres, 1 minuscula, 1 mayuscula y 1 numero
export const validatePassword = (password)=> {
    let response = {
        error: true,
    }
    if (password.length < 8) {
        response.message = "La contraseña debe tener minimo 8 caracteres"
    } else if (password.length > 20) {
        response.message = "La contraseña acepta un maximo de 20 caracteres"
    } else if (/\s/g.test(password)) {
        response.message = "La contraseña no puede contener espacios"
        return response
    } else if (/\W/g.test(password)) {
        response.message = "La contraseña no puede contener caracteres especiales"
        return response
    } else if (!/[a-z]/g.test(password)) {
        response.message = "La contraseña debe contener al menos 1 minuscula"
        return response
    } else if (!/[A-Z]/g.test(password)) {
        response.message = "La contraseña debe contener al menos 1 mayuscula"
        return response
    } else if (!/[0-9]/g.test(password)) {
        response.message = "La contraseña debe contener al menos 1 numero"
        return response
    }
    response.error = false
    return response
}