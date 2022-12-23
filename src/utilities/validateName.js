export const validateName = (name)=> {
    let response = {
        error: true
    }
    if (name.includes(' ')) {
        response.message = 'El nombre/apellido no puede contener espacios en blanco'
        return response
    } else if (name.length > 16) {
        response.message = 'El nombre/apellido solo acepta un maximo de 16 caracteres'
        return response
    } else if (/\W/g.test(name)) {
        response.message = 'El nombre/apellido no puede contener caracteres especiales'
        return response
    } else if (/[0-9]/g.test(name)) {
        response.message = 'El nombre/apellido no puede contener numeros'
        return response
    }
    response.error = false
    return response
}