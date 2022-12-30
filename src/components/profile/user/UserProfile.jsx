import "./userProfile.scss"
import { Navbar } from '../../navbar/Navbar'
import profileImg from "../../../assets/profile.png"
import searchImg from "../../../assets/search.png"
import { useEffect, useState } from "react"
import { getUserInfo, getUserPost } from "../../../services/user"
import { Link, useParams } from "react-router-dom"
import { Post } from "../../post/Post"

const Search = ()=> {
    const [search, setSearch] = useState('')
    const [searches, setSearches] = useState([])

    useEffect(()=> {
        let unsub = ()=> {
            if (search) {
                
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

const UserProfile = ({ user }) => {

    const [posteos, setPosteos] = useState([])
    const [info, setInfo] = useState(null)
    const [page, setPage] = useState(0)
    let { userId } = useParams()

    useEffect(()=> {
        let unsub = ()=> {
            getUserPost(userId, page).then(res => {
                if (res.status !== 'error') setPosteos(res.docs)
            })
            getUserInfo(userId).then(res => {
                if (res.status !== 'error') setInfo(res.user)
            })
        }
        return unsub()
    }, [])

    return (
        <div className="feedContainer">
            <Navbar user={user} />
            <div className="feed">
                <div className="content">
                    <Search />
                    {info && <div className="user">
                        <img width={120} height={120} src={info.image ? info.image : profileImg} alt={info.username} />
                        <div className="info">
                            <h4>{info.username}</h4>
                            {info.name ? (info.lastname ? <span>{info.name + ' ' + info.lastname}</span> : info.name) : (info.lastname ? <span>{info.lastname}</span> : '')}
                            <span>{info.genre === 0 ? 'Masculino' : 'Femenino'}</span>
                        </div>
                        <div className="count">
                            <span>{posteos.length > 0 ? posteos.length + ' publicaciones' : 'No hay publicaciones'}</span>
                        </div>
                    </div>}
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

export default UserProfile