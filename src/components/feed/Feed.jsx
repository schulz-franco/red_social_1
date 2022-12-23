import "./feed.scss"
import profileImg from "../../assets/profile.png"
import homeImg from "../../assets/home.png"
import logoutImg from "../../assets/logout.png"
import profileIconImg from "../../assets/profileIcon.png"
import settingsImg from "../../assets/settings.png"
import searchImg from "../../assets/search.png"

const Option = ({ name, img }) => {
    return(
        <div className="option">
            <img width={16} height={16} src={img} alt={name} />
            <span>{name}</span>
        </div>
    )
}

const Feed = ({ user }) => {

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
                    </div>
                </div>
                <div className="people">
                    
                </div>
            </div>
        </div>
    )
}

export default Feed