import { useState } from "react"
import { likePost, commentPost } from "../services/user"

const usePost = (myId, likes, postImage, postId, content) => {

    const [length, setLength] = useState(likes.length)
    const [commentLength, setCommentLength] = useState(0)
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
    let userStyle = !postImage ? {padding: '1rem'} : {}

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
                ev.target[0].value = ''
                setMyComments([{ id: res.id, username: res.username, image: res.image, content: res.content }, ...myComments ])
            }
        })
    }

    return {
        userStyle,
        ifLike,
        length,
        seeComments,
        myComments,
        onLikeHandler,
        onCommentHandler,
        onSeeCommentsHandler,
        commentLength,
        setCommentLength
    }
}

export default usePost