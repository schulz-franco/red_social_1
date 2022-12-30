import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getOne } from '../../services/user'
import { Navbar } from '../navbar/Navbar'
import { Post } from '../post/Post'

const Searches = ({ user }) => {

    const { postId } = useParams()
    const [post, setPost] = useState(null)

    useEffect(()=> {
        let unsub = ()=> {
            getOne(postId).then(res => {
                if (res.status !== 'error') setPost(res.doc)
                console.log(res.doc)
            })
        }
        return unsub()
    }, [])

    return (
        <div className="feedContainer">
            <Navbar user={user} />
            <div className="feed">
                <div className="content">
                    <div className="posteos">
                        {post && <Post key={post._id} comments={post.comments} myId={user.id} postId={post._id} likes={post.likes} userId={post.owner.id} userImage={post.owner.image ? post.owner.image : ''} username={post.owner.username} postImage={post.image ? post.image : ''} content={post.content ? post.content : ''} date={post.date} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Searches