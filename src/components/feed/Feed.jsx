import "./feed.scss"
import profileImg from "../../assets/profile.png"
import searchImg from "../../assets/search.png"
import addImagePost from "../../assets/addImagePost.png"
import useFeed from "../../hooks/useFeed"
import { Navbar } from "../navbar/Navbar"
import { Post } from "../post/Post"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { findPost } from "../../services/user"


const Search = ()=> {

    const [search, setSearch] = useState('')
    const [searches, setSearches] = useState([])

    useEffect(()=> {
        let unsub = ()=> {
            if (search) {
                findPost(search, 0).then(res => {
                    if (res.status !== 'error') setSearches(res.docs)
                })
            } else {
                setSearches([])
            }
        }
        return unsub()
    }, [search])

    return(
        <div className="search">
            <img width={20} height={20} src={searchImg} alt="Buscar" />
            <input onChange={ev => setSearch(ev.target.value)} placeholder="Buscar" type="text" />
            <div className="searches">
                {searches.length > 0 && searches.map(doc => {
                    return <Link to={'/post/' + doc._id} key={doc._id}>{doc.content.slice(0, 40)}...<b>@{doc.owner.username}</b></Link>
                })}
                {searches.length > 0 && <span>Ver todos los resultados...</span>}
            </div>
        </div>
    )
}

const Feed = ({ user }) => {

    const {
        error,
        inputFileRef,
        contentLength,
        loader,
        posteos,
        onSubmitHandler,
        onContentLengthHandler,
        onInputFileHandler
    } = useFeed(user)

    return (
        <div className="feedContainer">
            <Navbar user={user} />
            <div className="feed">
                <div className="content">
                    <Search />
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
                            return <Post key={doc._id} comments={doc.comments} myId={user.id} postId={doc._id} likes={doc.likes} userId={doc.owner.id} userImage={doc.owner.image ? doc.owner.image : ''} username={doc.owner.username} postImage={doc.image ? doc.image : ''} content={doc.content ? doc.content : ''} date={doc.date} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Feed