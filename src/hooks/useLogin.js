import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { validateUsername } from '../utilities/validateUsername'
import { validateEmail } from '../utilities/validateEmail'
import { validatePassword } from '../utilities/validatePassword'
import { register, auth } from '../services/user'

const useLogin = (user, setUser, setLogged) => {

    const [state, setState] = useState(true)
    const [checked, setChecked] = useState(true)
    const [error, setError] = useState({ value: false, message: '' })
    const navigate = useNavigate()

    const onStateHandler = (ev)=> {
        ev.preventDefault()
        setState(!state)
    }

    const onCheckHandler = ()=> {
        setChecked(!checked)
    }

    const onRegisterHandler = (ev)=> {
        ev.preventDefault()

        let result = validateUsername(ev.target[0].value)
        if (result.error) return setError({ value: result.error, message: result.message })

        result = validateEmail(ev.target[1].value)
        if (result.error) return setError({ value: result.error, message: result.message })

        result = validatePassword(ev.target[2].value)
        if (result.error) return setError({ value: result.error, message: result.message })

        register(ev.target[0].value.toLowerCase(), ev.target[1].value.toLowerCase(), ev.target[2].value).then(res => {
            if (res.status === 'error') {
                setError({ value: true, message: res.message })
            } else {
                setError({ value: false })
                setState(!state)
            }
        })
    }

    const onLoginHandler = (ev)=> {
        ev.preventDefault()
        auth(ev.target[0].value.toLowerCase(), ev.target[1].value).then(res => {
            if (res.status === 'error') {
                setError({ value: true, message: res.message })
            } else {
                setError({ value: false })
                setUser(res)
                setLogged(true)
                if (res.firstTime === 0) {
                    navigate('/perfil/opciones')
                } else {
                    navigate('/feed')
                }
            }
        })
    }

    return {
        state,
        onLoginHandler,
        onRegisterHandler,
        onCheckHandler,
        onStateHandler,
        error,
        checked
    }
}

export default useLogin