import profileImg from "../../assets/profile.png"
import usePost from "../../hooks/usePost"
import "./post.scss"

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

export const Post = ({ myId, postId, userId, userImage, username, postImage, content, likes, comments, date }) => {

    const {
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
    } = usePost(myId, likes, postImage, postId, content)

    return(
        <div className="post">
            <div style={userStyle} className="userInfo">
                <img width={36} height={36} className="profileImg" src={userImage ? userImage : profileImg} alt="" />
                <h4 id={userId} >{username}</h4>
                <span></span>
                {!postImage && <div className="actions"><div onClick={onLikeHandler} className={ifLike}/>{length}<div onClick={onSeeCommentsHandler} className='comment'></div>{comments.length}</div>}
            </div>
            <div className="postContent">
                {postImage && <img src={postImage} alt='Imagen' />}
                {postImage && <div className="actions"><div onClick={onLikeHandler} className={ifLike}/>{length}<div onClick={onSeeCommentsHandler} className='comment'></div>{comments.length}</div>}
                {content && <p>{content}</p>}
                {seeComments && 
                    <>
                    <div className="commentsContainer">
                        {myComments && myComments.map((comment, index) => {
                            return <Comment key={comment.id + index} postImage={postImage} userId={comment.id} username={comment.username} image={comment.image} content={comment.content} />
                        })}
                        {comments && comments.map((comment, index) => {
                            return <Comment key={comment.id + index} postImage={postImage} userId={comment.id} username={comment.username} image={comment.image} content={comment.content} />
                        })}
                        {(comments.length === 0 && myComments.length === 0) && <span className="noComments">No hay comentarios</span>}
                    </div>
                    <form onSubmit={(ev) => onCommentHandler(ev)} className="sendComment">
                        <input onChange={(ev) => setCommentLength(ev.target.value.length)} maxLength={200} required type="text" placeholder="Agrega un comentario..." />
                        <span>{commentLength}/200</span>
                    </form>
                    </>
                }
                <span className="date">{date.slice(0, 10)} {date.slice(11, 16)}</span>
            </div>
        </div>
    )
}