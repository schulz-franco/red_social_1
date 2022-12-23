import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Feed from "./components/feed/Feed";
import Login from "./components/login/Login"
import ProfileSettings from "./components/profile/settings/ProfileSettings"

function App() {
    
    const [logged, setLogged] = useState(false)
    const [user, setUser] = useState({})

    const RutaProtegida = ({children})=> {
        if (!logged) return <Navigate to="/login" />
        return children
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RutaProtegida></RutaProtegida>} />
                <Route path="/login" element={<Login user={user} setLogged={setLogged} setUser={setUser} />} />
                <Route path="/perfil/opciones" element={<RutaProtegida><ProfileSettings setUser={setUser} user={user} /></RutaProtegida>} />
                <Route path="/feed" element={<RutaProtegida><Feed user={user}/></RutaProtegida>} />
            </Routes>
        </BrowserRouter>	
    );
}

export default App;
