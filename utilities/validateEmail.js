// El email no puede contener espacios, caracteres especiales y tampoco mas de un arroba, ademas debe usar un dominio valido
const validateEmail = (email)=> {
    let validDomains = ['gmail', 'hotmail']
    let newEmail = email.replaceAll('@', '').replaceAll('_', '').replaceAll('.', '')
    if (!email.includes('@') || email.includes(' ') || email.split('@').length > 2 || /\W/g.test(newEmail) || email.length < 12) {
        return true  
    } else {
        let validDomain = false
        for (let domain of validDomains) {
            if (email.split('@')[1] === (domain + '.com')) {
                validDomain = true
                break
            }
        }
        if (!validDomain) {
            return true
        }
    }
    return false
}

module.exports = validateEmail