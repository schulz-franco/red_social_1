import { Link } from "react-router-dom" 
import homeImg from "../../assets/home.png"
import logoutImg from "../../assets/logout.png"
import profileIconImg from "../../assets/profileIcon.png"
import settingsImg from "../../assets/settings.png"
import profileImg from "../../assets/profile.png"
import "./navbar.scss"

const Option = ({ name, img, route }) => {
    return(
        <div className="option">
            <img width={20} height={20} src={img} alt={name} />
            <Link to={route}>{name}</Link>
        </div>
    )
}

export const Navbar = ({ user })=> {
    return(
        <div className="feedNavbar">
            <div className="userInfo">
                <img className="profileImg" width={64} height={64} src={user.image ? user.image : profileImg} alt="" />
                <h4>{user.username}</h4>
                <p>{user.name && user.name}{(user.name && user.lastname) && ' ' + user.lastname}{(!user.name && user.lastname) && user.lastname}</p>
            </div>
            <div className="menu">
                <span className="title">Menu</span>
                <Option route="/feed" name='Feed' img={homeImg} />
                <Option route={"/perfil/" + user.id} name='Perfil' img={profileIconImg} />
                <Option route="/perfil/opciones" name='Opciones' img={settingsImg} />
                <Option route="/login" name='Cerrar sesión' img={logoutImg} />
            </div>
        </div>
    )
}