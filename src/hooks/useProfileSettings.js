import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { updateNames, uploadImage } from "../services/user"
import { validateName } from "../utilities/validateName"

const useProfileSettings = (user, setUser) => {
    const [error, setError] = useState({ value: false })
    const [loader, setLoader] = useState(false)
    const navigate = useNavigate()

    const onSubmitHandler = (ev) => {
        ev.preventDefault()

        let result = validateName(ev.target[0].value)
        if (result.error) return setError({ value: result.error, message: result.message })

        result = validateName(ev.target[1].value)
        if (result.error) return setError({ value: result.error, message: result.message })

        if (parseInt(ev.target[2].value) !== 0 && parseInt(ev.target[2].value) !== 1) {
            return setError({ value: true, message: 'Género no valido' })
        }

        updateNames(user.email, ev.target[0].value.toLowerCase(), ev.target[1].value.toLowerCase(), parseInt(ev.target[2].value)).then(res => {
            if (res.status === 'success') {
                setUser({ ...user, name: ev.target[0].value.toLowerCase(), lastname: ev.target[1].value.toLowerCase(), genre: parseInt(ev.target[2].value)})
                setError({ value: false })
                navigate('/feed')
            } else {
                setError({ value: true, message: res.message })
            }
        })
    }

    const setImage = (ev) => {
        ev.preventDefault()
        let imagen = ev.target.files[0]
        ev.target.files = null
        ev.target.value = ''
        
        if (imagen && (imagen.size / 1024 / 1024) < 2) {
            uploadImage(user.email, imagen).then(res => {
                if (res.status === 'error') return setError({ value: true, message: res.message })
                setUser({ ...user, image: res.imagePath })
                return setError({ value: false })
            })
        } else {
            setError({ value: true, message: 'La imagen debe tener un peso menor a 2mb' })
        }
    }

    return {
        error,
        setImage,
        onSubmitHandler,
        loader
    }
}

export default useProfileSettings