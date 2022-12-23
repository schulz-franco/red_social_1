import "./profileSettings.scss"
import ProfileImg from "../../../assets/profile.png"
import AddImage from "../../../assets/addImage.png"
import Arrow from "../../../assets/arrow.png"
import useProfileSettings from "../../../hooks/useProfileSettings"

const ProfileSettings = ({ user, setUser }) => {

    const { error, setImage, onSubmitHandler, loader } = useProfileSettings(user, setUser)

    return (
        <div id="profileSettings">
            <div className="settings">
                <h3>Configurá tus datos</h3>
                <div className={error.value ? "container small" : "container"}>
                    {error.value && <span className={"error show"}>{error.message}</span>}
                    <form className={error.value ? "profileImg small" : "profileImg"}>
                        <img className="profileImage" width={128} height={128} src={user.image ? user.image : ProfileImg} alt="Imagen de perfil" />
                        <img className={error.value ? "button move" : "button"} width={40} height={40} src={AddImage} alt="Editar foto de perfil" />
                        <input className={error.value ? "move" : ''} type="file" accept="image/*" name="image" id="image" onChange={ev => setImage(ev)} />
                    </form>
                    <form onSubmit={ev => onSubmitHandler(ev)} id="names" className={error.value ? "names small" : "names"}>
                        <input maxLength={12} type="text" placeholder="Nombre" name="name" />
                        <input maxLength={12} type="text" placeholder="Apellido" name="lastname" />
                        <div className="selectContainer">
                            <select name="genero" id="genero">
                                <option value="0">Masculino</option>
                                <option value="1">Femenino</option>
                            </select>
                            <img width={16} height={16} src={Arrow} alt="Opciones"/>
                        </div>
                        <button form="names">Continuar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileSettings