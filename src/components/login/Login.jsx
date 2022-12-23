import useLogin from '../../hooks/useLogin'
import './login.scss'

const Login = ({ user, setLogged, setUser }) => {

    const { state, onLoginHandler, onRegisterHandler, onCheckHandler, onStateHandler, error, checked } = useLogin(user, setUser, setLogged)

    return (
        <div className='loginContainer'>
            <form onSubmit={(ev)=> state ? onLoginHandler(ev) : onRegisterHandler(ev)} className="loginForm">
                <h2>{state ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
                <div className="inputs">
                    {error.value && <span className='error'>{error.message}</span>}
                    {!state && <input placeholder='Usuario' minLength={6} maxLength={16} type="text" className="form-control" id="username" name="username" required />}
                    <input placeholder='Email' minLength={14} maxLength={40} type="email" className="form-control" id="email" name="email" required />
                    <input placeholder='Contraseña' minLength={8} maxLength={20} type="password" className="form-control" name="password" id="password" required/>
                    {state && <input type="checkbox" name="option" id="check" />}
                    {state && <label onClick={onCheckHandler} className={checked ? 'checked' : ''} htmlFor="check">Recordarme</label>}
                    <input className="form-control" type="submit" value={state ? "Iniciar" : "Registrar"} />
                </div>
                <label>{state ? '¿Nuevo usuario? ' : '¿Ya tenes cuenta? '}<button onClick={(ev)=> onStateHandler(ev)}>{state ? "Crear cuenta" : "Iniciar sesión"}</button></label>
            </form>
        </div>
    )
}

export default Login