import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from '../contexts/auth-context'
import axios from "axios"

export function Login() {

    const navigate = useNavigate();

    const {
        user, 
        setUser,
        loggedIn,
        setLoggedIn
    } = useAuth()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function In(e) {
        e.preventDefault()

        setLoggedIn(true)
        setUser({Username: username})

        // axios.post('http://localhost:5000/users/', {username: username, password: password})

        navigate('/homepage') // NAVIGATES TO HOMEPAGE AFTER REST OF FUNCTION RESOLVES

    }


    return <>
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)}/>
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        <button id="login-button" className="btn" onClick={(e) => {In(e)}}>Login!</button>
    </>
   }
