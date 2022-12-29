import "./userProfile.scss"
import { Navbar } from '../../navbar/Navbar'
import profileImg from "../../../assets/profile.png"
import searchImg from "../../../assets/search.png"
import { useEffect, useState } from "react"
import { getUserPost } from "../../../services/user"
import { Post } from "../../post/Post"

const Search = ()=> {
    return(
        <div className="search">
            <img width={20} height={20} src={searchImg} alt="Buscar" />
            <input placeholder="Buscar" type="text" />
        </div>
    )
}

const UserProfile = ({ user }) => {

    const [posteos, setPosteos] = useState([])
    const [page, setPage] = useState(0)

    useEffect(()=> {
        let unsub = ()=> {
            getUserPost(user.id, page).then(res => {
                if (res.status !== 'error') setPosteos(res.docs)
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
                    <div className="user">
                        <img width={120} height={120} src={user.image ? user.image : profileImg} alt={user.username} />
                        <div className="info">
                            <h4>{user.username}</h4>
                            {user.name ? (user.lastname ? <span>{user.name + ' ' + user.lastname}</span> : user.name) : (user.lastname ? <span>{user.lastname}</span> : '')}
                            <span>{user.genre === 0 ? 'Masculino' : 'Femenino'}</span>
                        </div>
                        <div className="count">
                            <span>{posteos.length > 0 ? posteos.length + ' publicaciones' : 'Sin publicaciones'}</span>
                        </div>
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

export default UserProfile