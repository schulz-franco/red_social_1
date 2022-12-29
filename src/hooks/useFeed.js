import { useRef, useState, useEffect } from "react"
import { newPost, getPost } from "../services/user"

const useFeed = (user) => {

    const [contentLength, setContentLength] = useState(0)
    const [error, setError] = useState({ value: false })
    const [loader, setLoader] = useState(false)
    const [posteos, setPosteos] = useState([])
    const [page, setPage] = useState(0)
    const [update, setUpdate] = useState(false)
    const inputFileRef = useRef()

    useEffect(()=> {
        let unsub = ()=> {
            getPost(page).then(res => {
                if (res.status === 'success') {
                    setPosteos(res.docs)
                }
            }) 
        }
        return unsub()
    }, [page, update])

    const onInputFileHandler = ()=> {
        inputFileRef.current.click()
    }

    const onContentLengthHandler = (ev)=> {
        setContentLength(ev.target.value.length)
    }

    const onSubmitHandler = async (ev)=> {
        ev.preventDefault()
        let content = ev.target[0].value ? ev.target[0].value : '' 
        let image = ev.target[1].files[0] ? ev.target[1].files[0] : ''
        ev.target[1].files = null
        ev.target[1].value = ''

        if (image && (image.size / 1024 / 1024) > 2) {
            return setError({ value: true, message: 'La imagen debe tener un peso menor a 2mb' })
        } else if (content.length > 600) {
            return setError({ value: true, message: 'El contenido es mayor a 600 caracteres' })
        }

        setLoader(true)
        await newPost(user.id, user.username, user.image, content, image).then(res => {
            if (res.status === 'error') {
                setError({ value: true, message: res.message })
            } else {
                setError({ value: false })
                setContentLength(0)
                setUpdate(!update)
                ev.target[0].value = ''
                console.log('post success')
            }
            setLoader(false)
        })
    }

    return {
        error,
        inputFileRef,
        contentLength,
        loader,
        posteos,
        onSubmitHandler,
        onContentLengthHandler,
        onInputFileHandler
    }
}

export default useFeed