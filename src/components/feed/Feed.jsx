import "./feed.scss"
import profileImg from "../../assets/profile.png"
import homeImg from "../../assets/home.png"
import logoutImg from "../../assets/logout.png"
import profileIconImg from "../../assets/profileIcon.png"
import settingsImg from "../../assets/settings.png"
import searchImg from "../../assets/search.png"
import addImagePost from "../../assets/addImagePost.png"
import { useRef } from "react"
import { useState } from "react"
import { newPost } from "../../services/user"

const Option = ({ name, img }) => {
    return(
        <div className="option">
            <img width={16} height={16} src={img} alt={name} />
            <span>{name}</span>
        </div>
    )
}

const Feed = ({ user }) => {

    const [contentLength, setContentLength] = useState(0)
    const [error, setError] = useState({ value: false })
    const [loader, setLoader] = useState(false)
    const inputFileRef = useRef()

    const onInputFileHandler = ()=> {
        inputFileRef.current.click()
    }

    const onContentLengthHandler = (ev)=> {
        setContentLength(ev.target.value.length)
    }

    const onSubmitHandler = (ev)=> {
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
        newPost(user.id, user.username, user.image, content, image).then(res => {
            if (res.status === 'error') {
                setError({ value: true, message: res.message })
            } else {
                setError({ value: false })
            }
            setLoader(false)
        })
    }

    return (
        <div className="feedContainer">
            <div className="feedNavbar">
                <div className="userInfo">
                    <img className="profileImg" width={64} height={64} src={user.image ? user.image : profileImg} alt="" />
                    <h4>{user.username}</h4>
                    <p>{user.name && user.name}{(user.name && user.lastname) && ' ' + user.lastname}{(!user.name && user.lastname) && user.lastname}</p>
                </div>
                <div className="menu">
                    <span className="title">Menu</span>
                    <Option name='Inicio' img={homeImg} />
                    <Option name='Perfil' img={profileIconImg} />
                    <Option name='Opciones' img={settingsImg} />
                    <Option name='Cerrar sesión' img={logoutImg} />
                </div>
            </div>
            <div className="feed">
                <div className="content">
                    <div className="search">
                        <img width={20} height={20} src={searchImg} alt="Buscar" />
                        <input placeholder="Buscar" type="text" />
                    </div>
                    <div className="newPost">
                        <div className="userInfo">
                            <img width={36} height={36} src={user.image ? user.image : profileImg} alt={user.username} />
                            <span>{user.username}</span>
                        </div>
                        {error.value && <span className="error">{error.message}</span>}
                        <form onSubmit={(ev)=> onSubmitHandler(ev)} className="userPost">
                            <textarea onChange={(ev) => onContentLengthHandler(ev)} maxLength={600} placeholder="¿Qué estas pensando?" name="content" id="content" cols="30" rows="6"></textarea>
                            <div className="buttons">
                                <input ref={inputFileRef} accept="image/*" hidden type="file" name="image" id="image" />
                                <span className="counter">{contentLength}/600</span>
                                <span></span>
                                <img onClick={onInputFileHandler} width={20} height={20} src={addImagePost} alt="Subir imagen" />
                                <input type="submit" value="Publicar" />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="people">
                    
                </div>
            </div>
        </div>
    )
}

export default Feed