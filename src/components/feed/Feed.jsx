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
import { newPost, getPost, likePost, commentPost } from "../../services/user"
import { useEffect } from "react"

const Option = ({ name, img }) => {
    return(
        <div className="option">
            <img width={20} height={20} src={img} alt={name} />
            <span>{name}</span>
        </div>
    )
}

const Comment = ({ userId, username, image, content, postImage }) => {

    let borderStyle = postImage ? {borderTop: 'none'} : {}

    return (
        <div style={borderStyle} className="comment">
            <div id={userId} className="user">
                <img width={20} height={20} src={image ? image : profileImg} alt={username} />
                <h4>{username}</h4>
            </div>
            <div>
                <p>{content}</p>
            </div>
        </div>
    )
}

const Post = ({ myId, postId, userId, userImage, username, postImage, content, likes, comments }) => {

    const [length, setLength] = useState(likes.length)
    const [like, setLike] = useState(null)
    const [seeComments, setSeeComments] = useState(false)
    const [myComments, setMyComments] = useState([])

    let liked = false
    for (let count = 0; count < likes.length; count++) {
        if (likes[count].id === myId) {
            liked = true
            break
        }
    }

    let ifLike = (like === null) ? (liked ? "like liked" : 'like') : (like ? 'like liked' : 'like')
    let contentStyle = (!postImage && !seeComments) ? {paddingTop: '.2rem'} : {}
    let userStyle = !postImage ? {padding: '1rem'} : {}
    let actionStyle = (postImage && !content) ? {borderBottom: '2px solid lightgray'} : {}

    const onSeeCommentsHandler = ()=> setSeeComments(!seeComments)

    const onLikeHandler = ()=> {
        likePost(myId, postId).then(res => {
            if (res.status !== 'error') {
                setLike(res.action)
                if (res.action) {
                    setLength(length + 1)
                } else {
                    setLength(length - 1)
                }
            }
        })
    }

    const onCommentHandler = (ev)=> {
        ev.preventDefault()
        commentPost(myId, postId, ev.target[0].value).then(res => {
            if (res.status !== 'error') {
                console.log(res)
                ev.target[0].value = ''
                setMyComments([{ id: res.id, username: res.username, image: res.image, content: res.content }, ...myComments ])
            }
        })
    }

    return(
        <div className="post">
            <div style={userStyle} className="userInfo">
                <img width={36} height={36} className="profileImg" src={userImage ? userImage : profileImg} alt="" />
                <h4 id={userId} >{username}</h4>
                <span></span>
                {!postImage && <div style={actionStyle} className="actions"><div onClick={onLikeHandler} className={ifLike}/>{length}<div onClick={onSeeCommentsHandler} className='comment'></div>{comments.length}</div>}
            </div>
            <div className="postContent">
                {postImage && <img src={postImage} alt='Imagen' />}
                {postImage && <div style={actionStyle} className="actions"><div onClick={onLikeHandler} className={ifLike}/>{length}<div onClick={onSeeCommentsHandler} className='comment'></div>{comments.length}</div>}
                {seeComments && 
                    <>
                    <div className="commentsContainer">
                        {myComments && myComments.map(comment => {
                            return <Comment postImage={postImage} userId={comment.id} username={comment.username} image={comment.image} content={comment.content} />
                        })}
                        {comments && comments.map(comment => {
                            return <Comment postImage={postImage} userId={comment.id} username={comment.username} image={comment.image} content={comment.content} />
                        })}
                    </div>
                    <form onSubmit={(ev) => onCommentHandler(ev)} className="sendComment">
                        <input maxLength={200} required type="text" placeholder="Agrega un comentario..." />
                    </form>
                    </>
                }
                {content && <p style={contentStyle}>{content}</p>}
            </div>
        </div>
    )
}

const Feed = ({ user }) => {

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
                                {loader && <div className="loader"><div></div><div></div><div></div></div>}
                                <img onClick={onInputFileHandler} width={20} height={20} src={addImagePost} alt="Subir imagen" />
                                <input type="submit" value="Publicar" />
                            </div>
                        </form>
                    </div>
                    <div className="posteos">
                        {posteos && posteos.map(doc => {
                            return <Post key={doc._id} comments={doc.comments} myId={user.id} postId={doc._id} likes={doc.likes} userId={doc.owner.id} userImage={doc.owner.image ? doc.owner.image : ''} username={doc.owner.username} postImage={doc.image ? doc.image : ''} content={doc.content ? doc.content : ''} />
                        })}
                    </div>
                </div>
                <div className="people">
                    
                </div>
            </div>
        </div>
    )
}

export default Feed